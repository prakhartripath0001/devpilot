# DevPilot 🚀

DevPilot is an AI-powered developer assistant and engineering intelligence platform built with a modern full-stack architecture featuring Next.js, Spring Boot, Spring AI, and PostgreSQL with pgvector.

---

## 🏗️ Architecture & Tech Stack

### Frontend (`/client`)
- **Framework:** [Next.js 16](https://nextjs.org/) (App Router) & [React 19](https://react.dev/)
- **Language:** TypeScript
- **Styling:** [Tailwind CSS v4](https://tailwindcss.com/) & [shadcn/ui](https://ui.shadcn.com/)
- **Theming:** `next-themes` (Dark / Light / System mode support)
- **Data Fetching:** [TanStack React Query](https://tanstack.com/query/latest)
- **Icons & Visuals:** `lucide-react`, `recharts`

### Backend (`/backend`)
- **Framework:** [Spring Boot 4](https://spring.io/projects/spring-boot)
- **Language & Runtime:** Java 21
- **AI Integration:** [Spring AI](https://spring.io/projects/spring-ai) (OpenAI Models & Text Embeddings)
- **Persistence:** Spring Data JPA / Hibernate
- **Database Migrations:** [Flyway](https://flywaydb.org/)
- **Security:** Spring Security & OAuth2 Client

### Database & Infrastructure
- **Database:** PostgreSQL 16 via [pgvector/pgvector:pg16](https://hub.docker.com/r/pgvector/pgvector)
- **Extensions:**
  - `vector` (Vector embeddings & semantic search)
  - `uuid-ossp` (UUID generation)
  - `hstore` (Key-value pairs storage)
- **Orchestration:** Docker Compose

---

## 📁 Project Structure

```text
devpilot/
├── backend/                       # Spring Boot Application
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/devPilot/backend/
│   │   │   └── resources/
│   │   │       ├── application.properties
│   │   │       └── db/migration/  # Flyway SQL migrations (e.g. V1__init_schema.sql)
│   ├── mvnw
│   └── pom.xml
├── client/                        # Next.js Frontend Application
│   ├── app/                       # App Router pages & layout
│   ├── components/                # UI & Provider components
│   │   ├── provider/              # Theme & context providers
│   │   └── ui/                    # Reusable shadcn/ui components
│   ├── lib/                       # Utility functions
│   └── package.json
├── docker/
│   └── postgres/
│       └── init-extension.sql     # Database initialization script (extensions)
├── docker-compose.yml             # Postgres + pgvector service definition
└── README.md
```

---

## 🛠️ Prerequisites

Make sure you have the following installed on your machine:
- [Docker](https://www.docker.com/) and Docker Compose
- [Node.js](https://nodejs.org/) (v20+ recommended) & `npm`
- [Java Development Kit (JDK 21)](https://adoptium.net/)

---

## 🚀 Getting Started

### 1. Start the Database (PostgreSQL + pgvector)

Start the containerized PostgreSQL database using Docker Compose:

```bash
docker compose up -d
```

Verify that the database is running and healthy:

```bash
docker compose ps
```

The database will automatically initialize extensions (`vector`, `hstore`, `"uuid-ossp"`).

### 2. Configure & Run Backend

Set your OpenAI API key as an environment variable:

```bash
export OPENAI_API_KEY="your-openai-api-key"
```

Navigate to the `backend` directory and run the application:

```bash
cd backend
./mvnw spring-boot:run
```

The backend server will start at `http://localhost:8080`.
Flyway will automatically apply any pending migrations located in `src/main/resources/db/migration/`.

### 3. Run Frontend

In a new terminal window, navigate to the `client` directory:

```bash
cd client
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## ⚙️ Configuration Reference

### Backend (`application.properties`)

| Property | Default Value | Description |
|---|---|---|
| `spring.datasource.url` | `jdbc:postgresql://localhost:5432/devpilot` | PostgreSQL connection URL |
| `spring.datasource.username` | `postgres` | Database username |
| `spring.datasource.password` | `postgres` | Database password |
| `spring.jpa.hibernate.ddl-auto` | `validate` | Schema validation mode |
| `spring.flyway.enabled` | `true` | Enables Flyway migrations |
| `spring.ai.openai.api-key` | `${OPENAI_API_KEY}` | OpenAI API Key |
| `spring.ai.openai.chat.model` | `gpt-4o-mini` | Chat completion model |
| `spring.ai.openai.embedding.model` | `text-embedding-3-small` | Vector embedding model |
| `server.port` | `8080` | Spring Boot server port |

---

## 🗄️ Database Migrations (Flyway)

Place versioned SQL scripts in `backend/src/main/resources/db/migration/`:
- **Naming Pattern:** `V<Version>__<Description>.sql` (e.g., `V1__init_schema.sql`, note the double underscore `__`).
- Migrations are validated and executed automatically on backend startup.
