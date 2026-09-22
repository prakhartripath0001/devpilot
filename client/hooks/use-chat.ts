"use client";

import { useCallback, useRef, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api, getApiBaseUrl } from "@/lib/apiBaseUrl";
import { queryKeys } from "@/lib/query-keys";

export function useChatSessions(repoId: string, enabled = true) {
  return useQuery({
    queryKey: queryKeys.chat.sessions(repoId),
    queryFn: () => api.listChatSessions(repoId),
    enabled: Boolean(repoId) && enabled,
  });
}

export function useCreateChatSession(repoId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (title?: string) => api.createChatSession(repoId, title),
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: queryKeys.chat.sessions(repoId),
      });
    },
  });
}

export function useChatMessages(sessionId: string | null) {
  return useQuery({
    queryKey: [...queryKeys.chat.all, "messages", sessionId || ""],
    queryFn: () => api.getChatMessages("", sessionId!),
    enabled: Boolean(sessionId),
  });
}

export function useStreamChat(sessionId: string | null) {
  const [streamText, setStreamText] = useState("");
  const [streaming, setStreaming] = useState(false);
  const queryClient = useQueryClient();
  const abortControllerRef = useRef<AbortController | null>(null);

  const stop = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
    setStreaming(false);
  }, []);

  const send = useCallback(
    async (content: string) => {
      if (!sessionId || !content.trim()) return;

      setStreaming(true);
      setStreamText("");

      const controller = new AbortController();
      abortControllerRef.current = controller;

      try {
        const response = await fetch(
          `${getApiBaseUrl()}/api/chat/sessions/${sessionId}/stream?question=${encodeURIComponent(content)}`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            credentials: "include",
            signal: controller.signal,
          }
        );

        if (!response.ok) {
          throw new Error("Streaming request failed");
        }

        const reader = response.body?.getReader();
        const decoder = new TextDecoder();

        if (reader) {
          let accumulated = "";
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            const chunk = decoder.decode(value, { stream: true });
            accumulated += chunk;
            setStreamText(accumulated);
          }
        }
      } catch (err: any) {
        if (err.name !== "AbortError") {
          console.error("Stream error:", err);
        }
      } finally {
        setStreaming(false);
        abortControllerRef.current = null;
        if (sessionId) {
          void queryClient.invalidateQueries({
            queryKey: [...queryKeys.chat.all, "messages", sessionId],
          });
        }
      }
    },
    [sessionId, queryClient]
  );

  return { send, stop, streaming, streamText };
}
