"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { api } from "@/lib/apiBaseUrl";
import { queryKeys } from "@/lib/query-keys";
import type { User } from "@/lib/api";

export function useCurrentUser() {
    return useQuery<User>({
        queryKey: queryKeys.auth.me(),
        queryFn: api.me,
        retry: false,
        staleTime: 5 * 60 * 1000,
    });
}

export function useLogout() {
    const queryClient = useQueryClient();
    const router = useRouter();

    return useMutation({
        mutationFn: api.logout,
        onSuccess: () => {
            queryClient.setQueryData(queryKeys.auth.me(), null);
            queryClient.invalidateQueries({ queryKey: queryKeys.auth.all });
            router.push("/login");
        },
    });
}

export function useAuth() {
    const query = useCurrentUser();
    const logoutMutation = useLogout();

    return {
        user: query.data ?? null,
        isLoading: query.isLoading,
        isAuthenticated: !!query.data,
        error: query.error,
        logout: logoutMutation.mutate,
        isLoggingOut: logoutMutation.isPending,
        refetch: query.refetch,
    };
}