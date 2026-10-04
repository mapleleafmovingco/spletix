import { createFileRoute } from "@tanstack/react-router";
import { convertToModelMessages, type UIMessage } from "ai";
import { streamChat } from "@/lib/ai/chat.server";

export const Route = createFileRoute("/api/chat")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const apiKey = process.env["LOVABLE_API_KEY"];
        if (!apiKey) return new Response("AI is not configured", { status: 500 });
        const body = (await request.json()) as { messages?: UIMessage[] };
        const messages = Array.isArray(body.messages) ? body.messages.slice(-20) : [];
        try {
          return streamChat(request, apiKey, await convertToModelMessages(messages));
        } catch (e) {
          const status = (e as { statusCode?: number }).statusCode ?? 500;
          return new Response("The assistant is unavailable right now.", { status });
        }
      },
    },
  },
});
