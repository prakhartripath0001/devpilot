import { ChatMessage } from "@/lib/api";
import { getApiBaseUrl } from "@/lib/apiBaseUrl";

export interface StreamChatOptions {
  signal?: AbortSignal;
  onUserMessage?: (message: ChatMessage) => void;
  onToken?: (token: string) => void;
  onAssistantMessage?: (message: ChatMessage) => void;
}

export async function streamChatMessage(
  sessionId: string,
  content: string,
  options?: StreamChatOptions
): Promise<void> {
  const url = `${getApiBaseUrl()}/api/chat/sessions/${sessionId}/messages`;
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify({ content }),
    signal: options?.signal,
  });

  if (!response.ok) {
    throw new Error(`Chat error: ${response.statusText}`);
  }

  const reader = response.body?.getReader();
  if (!reader) return;

  const decoder = new TextDecoder("utf-8");
  let buffer = "";

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split("\n");
    buffer = lines.pop() ?? "";

    let currentEvent = "";

    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed) continue;

      if (trimmed.startsWith("event:")) {
        currentEvent = trimmed.substring(6).trim();
      } else if (trimmed.startsWith("data:")) {
        const dataStr = trimmed.substring(5).trim();

        if (currentEvent === "user_message") {
          try {
            const userMsg = JSON.parse(dataStr) as ChatMessage;
            options?.onUserMessage?.(userMsg);
          } catch {
            // ignore
          }
        } else if (currentEvent === "token") {
          try {
            const token = JSON.parse(dataStr) as string;
            options?.onToken?.(token);
          } catch {
            options?.onToken?.(dataStr);
          }
        } else if (currentEvent === "assistant_message") {
          try {
            const assistantMsg = JSON.parse(dataStr) as ChatMessage;
            options?.onAssistantMessage?.(assistantMsg);
          } catch {
            // ignore
          }
        }
      }
    }
  }
}
