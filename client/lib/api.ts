export type IndexStatus = "PENDING" | "INDEXING" | "READY" | "FAILED";

export type User = {
    id: string;
    githubid: number;
    githubUsername: string;
    displayName: string;
    avatarUrl: string | null;
}

export type Repository = {
    id: string;
    githuRepoId: number;
    owner: string;
    name: string;
    fullName: string;
    isPrivate: boolean;
    defaultBranch: string;
    language: string | null;
    htmlUrl: string | null;
    description: string | null;
    indexStatus: IndexStatus;
    indexedAt: string | null;
    chunkCount: number;
    filesTotal: number;
    filesProceed: number;
    filesProcessed?: number;
    errorMessage: string | null;
}

export type IndexStatusResponse = {
    repositoryId: String;
    indexStatus: IndexStatus;
    filesTotal: number;
    filesProcessed: number;
    chunkCount: number;
    indexedAt: string | null;
    errorMessage: string | null;
}

export class ApiError extends Error {
    status: number;

    constructor(status: number, message: string) {
        super(message);
        this.status = status;
    }
}

export type Citation = {
    filePath: string;
    startLine?: number;
    endLine?: number;
    language?: string;
};

export type ChatMessage = {
    id: string;
    role: "USER" | "ASSISTANT";
    content: string;
    citations?: Citation[];
    createdAt?: string;
};

export type ChatSession = {
    id: string;
    repositoryId: string;
    title: string;
    createdAt: string;
};