"use client";

import { Suspense, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Spinner } from "@/components/ui/spinner";
import { useCurrentUser } from "@/hooks/use-auth";

function CallbackContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const next = searchParams.get("next") || "/";
    const error = searchParams.get("error");
    const { data: user, isLoading, isError } = useCurrentUser();

    useEffect(() => {
        if (error) {
            router.replace(`/login?error=${encodeURIComponent(error)}`);
            return;
        }

        if (!isLoading) {
            if (user) {
                router.replace(next);
            } else if (isError) {
                router.replace("/login?error=auth_failed");
            }
        }
    }, [user, isLoading, isError, error, next, router]);

    return (
        <div className="flex min-h-svh flex-col items-center justify-center gap-3">
            <Spinner className="size-8 text-primary" />
            <p className="text-sm text-muted-foreground animate-pulse">
                Authenticating...
            </p>
        </div>
    );
}

export default function AuthCallbackPage() {
    return (
        <Suspense
            fallback={
                <div className="flex min-h-svh flex-col items-center justify-center gap-3">
                    <Spinner className="size-8 text-primary" />
                </div>
            }
        >
            <CallbackContent />
        </Suspense>
    );
}