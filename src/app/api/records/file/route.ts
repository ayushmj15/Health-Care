import { NextResponse, type NextRequest } from "next/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";

export const dynamic = "force-dynamic";

/**
 * Authenticated file proxy for the private `records` bucket.
 * Only the owning user (or an admin) may read a file: the storage object's
 * folder is matched against the signed-in user's id before streaming.
 */
export async function GET(request: NextRequest) {
  const path = request.nextUrl.searchParams.get("path");
  if (!path) {
    return NextResponse.json({ error: "Missing file path." }, { status: 400 });
  }

  // Demo mode (no Supabase): there are no real files to stream.
  if (!isSupabaseConfigured()) {
    return NextResponse.json({ error: "Not available in demo mode." }, { status: 404 });
  }

  const { createClient } = await import("@/lib/supabase/server");
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Authentication required." }, { status: 401 });
  }

  const owner = path.split("/")[0];
  const { data: profile } = await supabase
    .from("users")
    .select("role")
    .eq("id", user.id)
    .maybeSingle();

  const isAdmin = profile?.role === "admin";
  if (owner !== user.id && !isAdmin) {
    return NextResponse.json({ error: "Forbidden." }, { status: 403 });
  }

  const { data, error } = await supabase.storage.from("records").download(path);
  if (error || !data) {
    return NextResponse.json({ error: "File not found." }, { status: 404 });
  }

  const headers = new Headers();
  headers.set("Content-Type", data.type || "application/octet-stream");
  headers.set("Cache-Control", "private, max-age=300");
  return new NextResponse(data, { status: 200, headers });
}