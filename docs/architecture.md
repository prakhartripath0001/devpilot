# Architecture & Design Decisions

This document outlines the high-level architecture of DevPilot, the design decisions we made, and the core workflows of the application.

## System Architecture

DevPilot is designed as a modular, decoupled full-stack application:

- **Frontend Client (Next.js 16 + React 19)**: Responsible for the user interface, routing, and client-side state management. It communicates with the backend via REST APIs.
- **Backend Service (Spring Boot 4 + Java 21)**: The core engine that handles authentication, repository indexing, vector embeddings generation, and AI chat interactions.
- **Database (PostgreSQL + pgvector)**: Acts as the primary data store for user profiles, repository metadata, and the vector database for storing embedded code chunks.

---

## Key Architectural Decisions

### 1. Retrieval-Augmented Generation (RAG) with `pgvector`
**Why?** Large Language Models (LLMs) do not inherently know about your private or specific codebase. By using RAG, we extract code from your repositories, generate vector embeddings (using OpenAI models via Spring AI), and store them in PostgreSQL using the `pgvector` extension. 
**Benefit:** When a user asks a question, we can perform a semantic similarity search in the database to retrieve the most relevant code chunks and feed them into the LLM as context. This guarantees highly accurate, grounded answers with citations, rather than AI hallucinations.

### 2. GitHub OAuth2 Single Sign-On (SSO)
**Why?** DevPilot needs access to user repositories to index them. Implementing custom username/password auth would add friction and require users to manually generate and input GitHub Personal Access Tokens.
**Benefit:** By leveraging Spring Security's OAuth2 Client, we provide a seamless 1-click login experience. We automatically securely fetch the user's GitHub identity and their OAuth access token.

### 3. AES Encryption for Token Storage
**Why?** To index repositories asynchronously in the background, the backend needs to persist the user's GitHub OAuth token. Storing tokens in plaintext is a severe security risk.
**Benefit:** We use a `TextEncryptor` with AES encryption (seeded via `ENCRYPTOR_PASSWORD` and `ENCRYPTOR_SALT` from the environment) to securely encrypt access tokens before saving them to the database. Tokens are only decrypted in memory when an indexing job requires GitHub API access.

### 4. Next.js App Router + React Query
**Why?** The Next.js App Router provides excellent routing primitives, nested layouts (like our AppShell), and optimized rendering. We paired this with TanStack React Query for data fetching.
**Benefit:** React Query handles complex client-side state, caching, and background refetching (e.g., polling the `IndexStatus` of a repository while it's being embedded), ensuring the UI stays snappy and synchronized with the backend.

---

## Core Workflows

### Authentication Flow
1. User clicks "Continue with GitHub" on the frontend.
2. User is redirected to the backend (`/oauth2/authorization/github`), which forwards them to GitHub.
3. Upon approval, GitHub redirects back to the backend.
4. Backend issues a secure, HttpOnly session cookie (`devpilot_auth`) and redirects the user to the `/dashboard`.

### Repository Indexing Flow
1. User selects a repository to import from the Dashboard.
2. The frontend sends a request to the backend.
3. The backend creates a `Repository` record with `IndexStatus = PENDING` and kicks off an asynchronous indexing job.
4. **The Indexer:**
   - Decrypts the user's GitHub token.
   - Clones or fetches the repository structure via the GitHub API.
   - Chunks the source code files.
   - Generates embeddings for each chunk via Spring AI.
   - Stores the embeddings in PostgreSQL (`pgvector`).
5. Status is updated to `COMPLETED`, and the frontend reflects this to the user.

### Chat & Semantic Search Flow
1. User asks a question about their indexed repository in the Chat UI.
2. The backend receives the prompt, generates an embedding for the question, and queries PostgreSQL for the top `K` most similar code chunks.
3. The retrieved chunks are appended as context to the user's prompt.
4. The enriched prompt is sent to the LLM (e.g., OpenAI).
5. The response is streamed back to the frontend, complete with citations referencing the retrieved files.
