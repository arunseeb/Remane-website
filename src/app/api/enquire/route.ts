import { NextRequest, NextResponse } from "next/server";

const FORMSPREE_ID = process.env.NEXT_PUBLIC_FORMSPREE_ID ?? "xlgvydll";

export async function POST(req: NextRequest) {
  let body: Record<string, string>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  if (!body.name || !body.email || !body.message) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  try {
    const res = await fetch(`https://formspree.io/f/${FORMSPREE_ID}`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify(body),
    });

    const data = await res.json().catch(() => ({})) as { error?: string; errors?: { message: string }[] };

    if (res.ok) return NextResponse.json({ ok: true });

    const error = data.error ?? data.errors?.[0]?.message ?? `Formspree error ${res.status}`;
    return NextResponse.json({ error }, { status: res.status });
  } catch (err) {
    console.error("Enquiry proxy error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
