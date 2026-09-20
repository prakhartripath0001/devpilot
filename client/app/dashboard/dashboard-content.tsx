"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/use-auth";
import { BrandMark } from "@/components/layout/app-shell";
import { ModeToggle } from "@/components/ui/mode-toggle";
import { Spinner } from "@/components/ui/spinner";
import { UserButton } from "@/components/layout/user-button";
import { Button } from "@/components/ui/button";

export function DashboardContent() {
    const { user, isLoading, isAuthenticated, logout, isLoggingOut } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!isLoading && !isAuthenticated) {
            router.replace("/login");
        }
    }, [isLoading, isAuthenticated, router]);

    if (isLoading || !isAuthenticated) {
        return (
            <div className="flex h-svh w-full items-center justify-center">
                <Spinner className="size-8" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background flex flex-col">
            <header className="sticky top-0 z-10 flex h-16 items-center justify-between border-b bg-background/80 px-6 backdrop-blur">
                <BrandMark />
                <div className="flex items-center gap-4">
                    <span className="text-sm text-muted-foreground hidden sm:inline-block">
                        Welcome, {user?.displayName || user?.githubUsername}
                    </span>
                    <ModeToggle />
                    <UserButton />
                </div>
            </header>
            
            <main className="flex-1 p-6">
                <div className="mx-auto max-w-4xl space-y-6">
                    <h1 className="text-3xl font-bold">Dashboard</h1>
                    <p className="text-muted-foreground">
                        You are successfully connected with GitHub. Your repositories and chats will appear here.
                    </p>
                </div>
            </main>
        </div>
    );
}
