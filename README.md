# DevPilot

DevPilot is an AI-powered developer assistant and engineering intelligence platform built to bridge the gap between software engineers and their codebases. By leveraging Retrieval-Augmented Generation (RAG), vector embeddings, and GitHub OAuth integration, DevPilot allows developers to interact naturally with their repositories, analyze code structures, and automate engineering workflows.

---

## What is DevPilot?

DevPilot provides an intelligent interface for exploring, understanding, and chatting with code repositories in real time. It indexes your source code repositories into vector embeddings using Spring AI and PostgreSQL (`pgvector`), enabling semantic code search, context-aware AI answers, and automated code insights.

### Key Capabilities & Features

- **GitHub OAuth Single Sign-On (SSO)**: Authenticate seamlessly via GitHub using Spring Security OAuth2 Client to sync user profiles and repository access.
- **Repository RAG Chat**: Perform semantic search and stream live responses grounded in your codebase using Spring AI (Google Gemini) and vector search powered by PostgreSQL `pgvector`.
- **Automated Repository Syncing**: Fetch, sync, and persist your connected GitHub repositories to track indexing statuses and metadata.
- **Encrypted Token Management**: Securely encrypt and store sensitive user OAuth tokens at rest using AES-based `TextEncryptor` credentials.
- **Modern Full-Stack Experience**: Built with Next.js 16 (App Router), React 19, Tailwind CSS v4, and shadcn/ui featuring dark/light mode switching.
- **Enterprise Spring Boot Backend**: Powered by Java 21, Spring Boot 4, Spring Data JPA, and Flyway database migrations.

---

## Architecture and Tech Stack

> **Deep Dive:** Read our [Architecture & Design Decisions](docs/architecture.md) and detailed [Setup & Running Guide](SETUP_GUIDE.md).

### Frontend (`/client`)
- **Framework:** [Next.js 16](https://nextjs.org/) (App Router) and [React 19](https://react.dev/)
- **Language:** TypeScript
- **Styling:** [Tailwind CSS v4](https://tailwindcss.com/) and [shadcn/ui](https://ui.shadcn.com/)
- **Theming:** `next-themes` (Dark / Light / System mode support)
- **Data Fetching:** [TanStack React Query](https://tanstack.com/query/latest)
- **Markdown & Syntax Highlighting:** `streamdown` and `@streamdown/code` with Shiki
- **Icons and Visuals:** `lucide-react`, Custom SVG icons (`GithubIcon`)

### Backend (`/backend`)
- **Framework:** [Spring Boot 4](https://spring.io/projects/spring-boot)
- **Language and Runtime:** Java 21
- **AI Integration:** [Spring AI](https://spring.io/projects/spring-ai) (Google Gemini Models & Embeddings)
- **Persistence:** Spring Data JPA / Hibernate
- **Database Migrations:** [Flyway](https://flywaydb.org/)
- **Security:** Spring Security and OAuth2 Client (GitHub authentication)

### Database and Infrastructure
- **Database:** PostgreSQL 16 via [pgvector/pgvector:pg16](https://hub.docker.com/r/pgvector/pgvector)
- **Extensions:**
  - `vector` (Vector embeddings and semantic search)
  - `uuid-ossp` (UUID generation)
  - `hstore` (Key-value pairs storage)
- **Orchestration:** Docker & Docker Compose

---

## Quick Start & How to Run

> For full detailed setup instructions, troubleshooting, and configuration details, see **[SETUP_GUIDE.md](SETUP_GUIDE.md)**.

### Prerequisites

- [Docker](https://www.docker.com/) and Docker Compose
- [Java Development Kit (JDK 21)](https://adoptium.net/) *(for local development)*
- [Node.js (v20+)](https://nodejs.org/) & `npm` *(for local development)*

---

### Option 1: Run via Docker Compose (Single Command)

1. Clone the repo and create root `.env` configuration:

```bash
git clone https://github.com/prakhartripath0001/devpilot.git
cd devpilot

cp backend/.env.example backend/.env
cp client/.env.example client/.env
```

2. Configure `backend/.env` with your **Google Gemini API Key** and **GitHub OAuth credentials**.

3. Start all services via Docker Compose:

```bash
docker compose up --build -d
```

4. Open **`http://localhost:3000`** in your browser.

---

### Option 2: Run Locally (Development Mode)

#### 1. Start Database (PostgreSQL + pgvector)

```bash
docker compose up -d postgres
```

#### 2. Run Backend (Spring Boot)

```bash
cd backend
./mvnw spring-boot:run
```

Backend will run on **`http://localhost:8080`**.

#### 3. Run Frontend (Next.js)

```bash
cd client
npm install
npm run dev
```

Frontend will run on **`http://localhost:3000`**.

---

## Environment Variables Reference

**Backend** (`backend/.env`):

| Variable | Required | Description |
|---|---|---|
| `DB_URL` | Yes | PostgreSQL JDBC URL (e.g., `jdbc:postgresql://localhost:5432/devpilot`) |
| `DB_USERNAME` | Yes | Database username (`postgres`) |
| `DB_PASSWORD` | Yes | Database password (`postgres`) |
| `GEMINI_API_KEY` | Yes | Google Gemini API key |
| `ENCRYPTOR_PASSWORD` | Yes | Secret used to encrypt stored access tokens |
| `ENCRYPTOR_SALT` | Yes | 16-char hex salt for the encryptor |
| `GITHUB_CLIENT_ID` | Yes | GitHub OAuth2 App client ID |
| `GITHUB_CLIENT_SECRET` | Yes | GitHub OAuth2 App client secret |
| `SERVER_PORT` | No | Spring Boot port (default: `8080`) |

**Client** (`client/.env`):

| Variable | Required | Description |
|---|---|---|
| `NEXT_PUBLIC_API_BASE_URL` | Yes | Backend base URL (`http://localhost:8080`) |
| `NEXT_PUBLIC_GITHUB_CLIENT_ID` | No | GitHub OAuth2 client ID (public-safe) |

> **GitHub OAuth App Redirect URI:** `http://localhost:8080/login/oauth2/code/github`

---

## Database Migrations (Flyway)

Versioned SQL scripts are maintained in `backend/src/main/resources/db/migration/`:
- `V1__init_schema.sql`
- `V2__create_users_table.sql`
- `V3__create_repositories_table.sql`
- `V4__create_chat_tables.sql`

Migrations run automatically on backend startup.
