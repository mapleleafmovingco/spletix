import { createOpenAI } from "@ai-sdk/openai";
import { streamText, type ModelMessage } from "ai";
import {
  createLovableAiGatewayRunIdFetch,
  getLovableAiGatewayRunId,
  withLovableAiGatewayRunIdHeader,
} from "./run-id.server";

const SYSTEM = `You are Forge, the assistant for Stackforge Labs — an enterprise software studio.
Services: full-stack web apps, mobile apps, AI automation & agents, cloud & DevOps, data & analytics, security & compliance, systems integrations, product design.
Stack: React, TypeScript, Node.js, PostgreSQL, cloud platforms, LLM pipelines, CI/CD.
Help visitors understand services, suggest an approach and rough architecture, and invite them to sign in to the Client Portal to submit a project request.
Be concise (under 150 words), friendly, and use markdown lists when helpful. Never invent prices; say pricing depends on scope.`;

export function streamChat(request: Request, apiKey: string, messages: ModelMessage[]) {
  const runIdFetch = createLovableAiGatewayRunIdFetch(getLovableAiGatewayRunId(request));
  const provider = createOpenAI({
    baseURL: "https://ai.gateway.lovable.dev/v1",
    apiKey,
    headers: { "Lovable-API-Key": apiKey, "X-Lovable-AIG-SDK": "vercel-ai-sdk" },
    fetch: runIdFetch.fetch,
  });
  const result = streamText({
    model: provider.responses("openai/gpt-6-astra"),
    system: SYSTEM,
    messages,
    abortSignal: request.signal,
    providerOptions: {
      openai: {
        forceReasoning: true,
        reasoningEffort: "low",
        reasoningSummary: "auto",
        store: false,
        include: ["reasoning.encrypted_content"],
      },
    },
  });
  return withLovableAiGatewayRunIdHeader(result.toUIMessageStreamResponse(), runIdFetch);
}
