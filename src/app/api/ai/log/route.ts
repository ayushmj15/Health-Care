import { NextResponse } from "next/server";
import { logAiUsage } from "@/lib/services/admin.server";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    await logAiUsage({
      action: String(body.action ?? "general"),
      tokens_in: Number(body.tokens_in ?? 0),
      tokens_out: Number(body.tokens_out ?? 0),
      latency_ms: Number(body.latency_ms ?? 0),
    });
  } catch {
    // Never fail the AI request because logging failed.
  }
  return NextResponse.json({ ok: true });
}
