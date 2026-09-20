# DevPilot

DevPilot is an AI-powered developer assistant and engineering intelligence platform built to bridge the gap between software engineers and their codebases. By leveraging Retrieval-Augmented Generation (RAG), vector embeddings, and GitHub OAuth integration, DevPilot allows developers to interact naturally with their repositories, analyze code structures, and automate engineering workflows.

---

## What is DevPilot?

DevPilot provides an intelligent interface for exploring, understanding, and chatting with code repositories in real time. It indexes your source code repositories into vector embeddings using Spring AI and PostgreSQL (`pgvector`), enabling semantic code search, context-aware AI answers, and automated code insights.

### Key Capabilities & Features

- **GitHub OAuth Single Sign-On (SSO)**: Authenticate seamlessly via GitHub using Spring Security OAuth2 Client to sync user profiles and repository access.
- **Repository RAG Chat**: Perform semantic search and chat directly with your codebase using Spring AI and vector search powered by PostgreSQL `pgvector`.
- **Automated Repository Syncing**: Fetch, sync, and persist your connected GitHub repositories to track indexing statuses and metadata.
- **Encrypted Token Management**: Securely encrypt and store sensitive user OAuth tokens at rest using AES-based `TextEncryptor` credentials.
- **Modern Full-Stack Experience**: Built with Next.js 16 (App Router), React 19, Tailwind CSS v4, and shadcn/ui featuring dark/light mode switching.
- **Enterprise Spring Boot Backend**: Powered by Java 21, Spring Boot 4, Spring Data JPA, and Flyway database migrations.

---

## Architecture and Tech Stack

> 💡 **Deep Dive:** Want to know *why* we chose this stack and how the core RAG and OAuth workflows operate? Read our [Architecture & Design Decisions](docs/architecture.md) guide.

### Frontend (`/client`)
- **Framework:** [Next.js 16](https://nextjs.org/) (App Router) and [React 19](https://react.dev/)
- **Language:** TypeScript
- **Styling:** [Tailwind CSS v4](https://tailwindcss.com/) and [shadcn/ui](https://ui.shadcn.com/)
- **Theming:** `next-themes` (Dark / Light / System mode support)
- **Data Fetching:** [TanStack React Query](https://tanstack.com/query/latest)
- **Icons and Visuals:** `lucide-react`, Custom SVG icons (`GithubIcon`)

### Backend (`/backend`)
- **Framework:** [Spring Boot 4](https://spring.io/projects/spring-boot)
- **Language and Runtime:** Java 21
- **AI Integration:** [Spring AI](https://spring.io/projects/spring-ai) (OpenAI Models and Text Embeddings)
- **Persistence:** Spring Data JPA / Hibernate
- **Database Migrations:** [Flyway](https://flywaydb.org/)
- **Security:** Spring Security and OAuth2 Client (GitHub authentication)

### Database and Infrastructure
- **Database:** PostgreSQL 16 via [pgvector/pgvector:pg16](https://hub.docker.com/r/pgvector/pgvector)
- **Extensions:**
  - `vector` (Vector embeddings and semantic search)
  - `uuid-ossp` (UUID generation)
  - `hstore` (Key-value pairs storage)
- **Orchestration:** Docker Compose

---

## Project Structure

```text
devpilot/
├── backend/                       # Spring Boot Application
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/devPilot/backend/
│   │   │   │   ├── config/        # Security, CORS, and crypto configuration
│   │   │   │   ├── controller/    # REST API endpoints (Auth, etc.)
│   │   │   │   ├── dto/           # Data Transfer Objects (UserResponse, etc.)
│   │   │   │   ├── entity/        # JPA entities (User, etc.)
│   │   │   │   ├── exceptions/    # Custom exceptions and global handler
│   │   │   │   ├── repository/    # Spring Data JPA repositories
│   │   │   │   ├── security/      # OAuth2 principal, GitHub user service, CurrentUser
│   │   │   │   └── service/       # Business logic services
│   │   │   └── resources/
│   │   │       ├── application.properties
│   │   │       └── db/migration/  # Flyway SQL migrations
│   ├── .env                       # Secrets (gitignored — never commit)
│   ├── .env.example               # Template to copy from 
│   ├── mvnw
│   └── pom.xml
├── client/                        # Next.js Frontend Application
│   ├── app/                       # App Router pages and layouts
│   │   └── login/                 # OAuth Login page, content, and loading skeleton
│   │       ├── loading.tsx
│   │       ├── login-content.tsx
│   │       └── page.tsx
│   ├── components/                # UI and Layout components
│   │   ├── icons/                 # Custom SVG icons (GithubIcon, etc.)
│   │   ├── layout/                # App Shell & BrandMark layout components
│   │   ├── provider/              # Theme and context providers
│   │   └── ui/                    # Reusable shadcn/ui components
│   ├── lib/                       # Utility functions, API helpers, base URLs
│   ├── .env                       # Secrets (gitignored — never commit)
│   ├── .env.example               # Template to copy from 
│   └── package.json
├── docker/
│   └── postgres/
│       └── init-extension.sql     # Database initialization script
├── docker-compose.yml             # Postgres + pgvector service definition
└── README.md
```

---

## Prerequisites

Make sure you have the following installed on your machine:
- [Docker](https://www.docker.com/) and Docker Compose
- [Node.js](https://nodejs.org/) (v20+ recommended) and `npm`
- [Java Development Kit (JDK 21)](https://adoptium.net/)

---

## Getting Started

### 1. Clone and Configure Environment Variables

Each service ships with a `.env.example` template. Copy it and fill in your real values:

```bash
# Backend
cp backend/.env.example backend/.env

# Frontend
cp client/.env.example client/.env
```

> **Never commit `.env` files.** They are gitignored by default. Only `.env.example` files (which contain no secrets) are committed.

**Backend** (`backend/.env`) — full reference:

| Variable | Required | Description |
|---|---|---|
| `DB_URL` | Yes | PostgreSQL JDBC URL |
| `DB_USERNAME` | Yes | Database username |
| `DB_PASSWORD` | Yes | Database password |
| `OPENAI_API_KEY` | Yes | OpenAI API key |
| `ENCRYPTOR_PASSWORD` | Yes | Secret used to encrypt stored access tokens |
| `ENCRYPTOR_SALT` | Yes | 16-char hex salt for the encryptor |
| `GITHUB_CLIENT_ID` | Yes | GitHub OAuth2 App client ID |
| `GITHUB_CLIENT_SECRET` | Yes | GitHub OAuth2 App client secret |
| `SERVER_PORT` | No | Spring Boot port (default: `8080`) |

> To create a GitHub OAuth App, go to **Settings -> Developer settings -> OAuth Apps -> New OAuth App**. Set the callback URL to `http://localhost:8080/login/oauth2/code/github`.

**Client** (`client/.env`) — full reference:

| Variable | Required | Description |
|---|---|---|
| `NEXT_PUBLIC_API_BASE_URL` | Yes | Backend base URL (e.g. `http://localhost:8080`) |
| `NEXT_PUBLIC_GITHUB_CLIENT_ID` | No | GitHub OAuth2 client ID (public-safe) |

### 2. Start the Database (PostgreSQL + pgvector)

Start the containerized PostgreSQL database using Docker Compose:

```bash
docker compose up -d
```

Verify that the database is running and healthy:

```bash
docker compose ps
```

The database will automatically initialize extensions (`vector`, `hstore`, `"uuid-ossp"`).

### 3. Configure and Run Backend

Navigate to the `backend` directory and run the application:

```bash
cd backend
./mvnw spring-boot:run
```

The backend server will start at `http://localhost:8080`.
Flyway will automatically apply any pending migrations located in `src/main/resources/db/migration/`.

### 4. Run Frontend

In a new terminal window, navigate to the `client` directory:

```bash
cd client
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Environment Variables

All sensitive configuration is managed via `.env` files that are **gitignored**. The backend imports `.env` natively via `spring.config.import=optional:file:.env[.properties]` in `application.properties` and uses Spring's `${VAR:default}` syntax to read environment variables with sensible defaults for local development.

---

## Database Migrations (Flyway)

Place versioned SQL scripts in `backend/src/main/resources/db/migration/`:
- **Naming Pattern:** `V<Version>__<Description>.sql` (e.g., `V1__init_schema.sql`, note the double underscore `__`).
- Migrations are validated and executed automatically on backend startup.
