import { NextResponse } from "next/server";
import { GEMINI_SYSTEM_PROMPT, localHealthAnswer, type AiMessage } from "@/lib/ai";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

interface GeminiPart {
  text: string;
}

interface GeminiContent {
  role: "user" | "model";
  parts: GeminiPart[];
}

/** Maps our internal messages to the Gemini `contents` shape. */
function toGeminiContents(messages: AiMessage[]): GeminiContent[] {
  return messages
    .filter((m) => m.content.trim().length > 0)
    .map((m) => ({
      role: m.role === "assistant" ? "model" : "user",
      parts: [{ text: m.content }],
    }));
}

/** Calls the Gemini generateContent REST API. */
async function callGemini(messages: AiMessage[], action: string) {
  const apiKey = process.env.GEMINI_API_KEY;
  const model = process.env.GEMINI_MODEL ?? "gemini-1.5-flash";

  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        systemInstruction: {
          parts: [
            {
              text: `${GEMINI_SYSTEM_PROMPT}\n\nContext: the user is asking about health topic "${action}".`,
            },
          ],
        },
        contents: toGeminiContents(messages),
        generationConfig: {
          temperature: 0.7,
          topP: 0.9,
          maxOutputTokens: 1024,
        },
      }),
    },
  );

  const body = await res.json().catch(() => null);

  if (!res.ok) {
    const reason = body?.error?.message ?? `Gemini API error (HTTP ${res.status})`;
    throw new Error(reason);
  }

  const text = body?.candidates?.[0]?.content?.parts?.map((p: GeminiPart) => p.text).join("") ?? null;
  if (!text) throw new Error("Gemini returned an empty response.");

  return {
    content: text,
    tokensIn: body?.usageMetadata?.promptTokenCount ?? 0,
    tokensOut: body?.usageMetadata?.candidatesTokenCount ?? 0,
  };
}

export async function POST(req: Request) {
  let payload: { messages?: AiMessage[]; action?: string };
  try {
    payload = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const messages = Array.isArray(payload.messages) ? payload.messages : [];
  const action = typeof payload.action === "string" ? payload.action : "general";

  if (messages.length === 0) {
    return NextResponse.json({ error: "No messages provided." }, { status: 400 });
  }

  const lastUserMessage = [...messages].reverse().find((m) => m.role === "user")?.content ?? "";

  const startedAt = Date.now();

  try {
    let content: string;
    let tokensIn = 0;
    let tokensOut = 0;

    if (process.env.GEMINI_API_KEY) {
      const result = await callGemini(messages, action);
      content = result.content;
      tokensIn = result.tokensIn;
      tokensOut = result.tokensOut;
    } else {
      content = localHealthAnswer(lastUserMessage);
    }

    // Fire-and-forget analytics — never blocks the response.
    void fetch(`${new URL(req.url).origin}/api/ai/log`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action,
        tokens_in: tokensIn,
        tokens_out: tokensOut,
        latency_ms: Date.now() - startedAt,
      }),
      keepalive: true,
    }).catch(() => {});

    return NextResponse.json({ content });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Something went wrong.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
