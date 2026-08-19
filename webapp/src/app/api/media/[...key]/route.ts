import { NextResponse } from "next/server";
import { getObjectStream } from "@/lib/s3";

// Railway Buckets are private — there is no public bucket URL — so every
// media asset on the public site is served through this proxy. See
// src/lib/s3.ts and the Phase 2 notes in webapp/README.md.
export async function GET(_req: Request, { params }: { params: Promise<{ key: string[] }> }) {
  const { key: keyParts } = await params;
  const key = keyParts.join("/");

  if (key.includes("..")) {
    return NextResponse.json({ error: "Invalid key" }, { status: 400 });
  }

  try {
    const object = await getObjectStream(key);
    if (!object.Body) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    const webStream = object.Body.transformToWebStream();
    return new Response(webStream, {
      headers: {
        "Content-Type": object.ContentType ?? "application/octet-stream",
        "Cache-Control": "public, max-age=31536000, immutable",
        ...(object.ContentLength ? { "Content-Length": String(object.ContentLength) } : {}),
      },
    });
  } catch {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
}
