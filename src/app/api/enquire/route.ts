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
    const formData = new FormData();
    formData.append("name", body.name);
    formData.append("email", body.email);
    formData.append("phone", body.phone ?? "");
    formData.append("message", body.message);

    const res = await fetch(`https://formspree.io/f/${FORMSPREE_ID}`, {
      method: "POST",
      headers: { Accept: "application/json" },
      body: formData,
    });

    const text = await res.text();
    console.log("Formspree response:", res.status, text.slice(0, 300));

    if (res.ok) return NextResponse.json({ ok: true });

    let data: { error?: string; errors?: { message: string }[] } = {};
    try { data = JSON.parse(text); } catch { /* non-JSON response */ }

    const error = data.error ?? data.errors?.[0]?.message ?? `Formspree ${res.status}: ${text.slice(0, 100)}`;
    return NextResponse.json({ error }, { status: res.status });
  } catch (err) {
    console.error("Enquiry proxy error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
