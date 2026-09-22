# DevPilot — Setup & Running Guide

This guide provides step-by-step instructions for setting up and running **DevPilot** using either **Local Development Mode** or **Full Docker Containerization Mode**.

---

## Prerequisites

Before proceeding, ensure you have the following installed on your machine:

- **Git**
- **Docker & Docker Compose** (Desktop or Engine)
- **Java 21 JDK** (For Local Mode) — e.g., Eclipse Temurin 21
- **Node.js (v20+) & npm** (For Local Mode)

---

## GitHub OAuth App Setup

DevPilot uses GitHub OAuth 2.0 for single sign-on authentication. You need to create a GitHub OAuth App:

1. Open GitHub and navigate to **Settings** → **Developer settings** → **OAuth Apps**.
2. Click **New OAuth App**.
3. Fill in the fields:
   - **Application name:** `DevPilot`
   - **Homepage URL:** `http://localhost:3000`
   - **Authorization callback URL:** `http://localhost:8080/login/oauth2/code/github`
4. Click **Register application**.
5. Copy your **Client ID** and generate a new **Client Secret**. Keep these values handy for your `.env` configuration.

---

## Method 1: Local Development Mode (Recommended for Development)

In this mode, PostgreSQL with `pgvector` runs inside Docker, while the Backend and Frontend run locally with hot-reloading.

### Step 1: Clone the Repository & Configure Environment Variables

1. Copy the template `.env` files for both backend and client:

```bash
# From project root directory
cp backend/.env.example backend/.env
cp client/.env.example client/.env
```

2. Edit `backend/.env` with your real keys:

```properties
DB_URL=jdbc:postgresql://localhost:5432/devpilot
DB_USERNAME=postgres
DB_PASSWORD=postgres

GEMINI_API_KEY=your_google_gemini_api_key_here

ENCRYPTOR_PASSWORD=mySecretEncryptorPassword123
ENCRYPTOR_SALT=1234567890abcdef

GITHUB_CLIENT_ID=your_github_client_id
GITHUB_CLIENT_SECRET=your_github_client_secret

SERVER_PORT=8080
```

3. Edit `client/.env`:

```properties
NEXT_PUBLIC_API_BASE_URL=http://localhost:8080
NEXT_PUBLIC_GITHUB_CLIENT_ID=your_github_client_id
```

---

### Step 2: Start PostgreSQL with `pgvector`

Start only the PostgreSQL container in the background:

```bash
docker compose up -d postgres
```

Verify that the database is healthy and running on port `5432`:

```bash
docker compose ps
```

The database container automatically initializes required PostgreSQL extensions (`vector`, `uuid-ossp`, `hstore`).

---

### Step 3: Run the Spring Boot Backend

1. Navigate to the `backend` directory:

```bash
cd backend
```

2. Compile and start the Spring Boot server using Maven wrapper:

```bash
./mvnw spring-boot:run
```

3. The backend will start on **`http://localhost:8080`**. Flyway automatically runs database migrations (`V1` through `V4`).

---

### Step 4: Run the Next.js Frontend

1. In a **new terminal window**, navigate to the `client` directory:

```bash
cd client
```

2. Install npm dependencies:

```bash
npm install
```

3. Start the Next.js development server:

```bash
npm run dev
```

4. The frontend will start on **`http://localhost:3000`**.

---

### Step 5: Test the Application

1. Open your browser and navigate to **`http://localhost:3000`**.
2. Click **Sign in with GitHub**.
3. Authenticate with GitHub — you will be redirected back to the DevPilot dashboard upon successful OAuth handshake.
4. Select a repository to index and start chatting!

---

## Method 2: Full Docker Setup (Single Command Startup)

Run the entire DevPilot stack (Database, Backend, and Frontend) inside Docker containers.

### Step 1: Configure Environment Variables

Ensure `.env` files are configured in both `backend` and `client` directories as described in **Method 1 Step 1**.

Additionally, create a root `.env` file (or export variables in your terminal) with your GitHub and Gemini credentials for Docker Compose:

```bash
cat <<EOF > .env
GEMINI_API_KEY=your_google_gemini_api_key_here
ENCRYPTOR_PASSWORD=mySecretEncryptorPassword123
ENCRYPTOR_SALT=1234567890abcdef
GITHUB_CLIENT_ID=your_github_client_id
GITHUB_CLIENT_SECRET=your_github_client_secret
NEXT_PUBLIC_GITHUB_CLIENT_ID=your_github_client_id
EOF
```

---

### Step 2: Build and Launch All Containers

From the project root directory, run:

```bash
docker compose up --build -d
```

This command will:
- Pull and launch the `pgvector/pgvector:pg16` database container.
- Build the Spring Boot JAR inside a Java 21 Docker image and run `devpilot-backend`.
- Build the Next.js application inside a Node 20 Docker image and run `devpilot-client`.

---

### Step 3: Check Container Status & Logs

Check container status:

```bash
docker compose ps
```

View live logs:

```bash
# All containers
docker compose logs -f

# Specific container
docker compose logs -f backend
```

---

### Step 4: Access the Application

- **Frontend App:** [http://localhost:3000](http://localhost:3000)
- **Backend API:** [http://localhost:8080](http://localhost:8080)

---

### Step 5: Stop Containers

To stop and remove containers:

```bash
docker compose down
```

To stop containers and reset database data volume:

```bash
docker compose down -v
```

---

## Troubleshooting

| Issue | Cause | Solution |
|---|---|---|
| **Database Connection Refused** | PostgreSQL container not ready | Run `docker compose ps` and wait until `postgres` status shows `(healthy)`. |
| **OAuth Redirect Error** | Callback URL mismatch | Verify GitHub OAuth App callback URL is exact: `http://localhost:8080/login/oauth2/code/github`. |
| **Vector Store / LLM Error** | Missing or invalid Gemini API Key | Check `GEMINI_API_KEY` in `backend/.env`. |
| **Port 5432 or 8080 in use** | Local service running | Stop local PostgreSQL or conflicting background processes (`lsof -i :8080`). |
