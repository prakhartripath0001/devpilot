export type User = {
    id: string;
    githubid: number;
    githubUsername: string;
    displayName: String;
    avatarUrl: string | null;
}

export class ApiError extends Error {
    status: number;

    constructor(status: number, message: string) {
        super(message);
        this.status = status;
    }
}