import { NextRequest, NextResponse } from "next/server";

const RESEND_API_KEY = process.env.RESEND_API_KEY;
const ENQUIRY_TO = process.env.ENQUIRY_TO_EMAIL;

export async function POST(req: NextRequest) {
  if (!RESEND_API_KEY || !ENQUIRY_TO) {
    console.error("Missing RESEND_API_KEY or ENQUIRY_TO_EMAIL env var");
    return NextResponse.json({ error: "Server configuration error" }, { status: 500 });
  }

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
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: "Remane <onboarding@resend.dev>",
        to: [ENQUIRY_TO],
        reply_to: body.email,
        subject: `New enquiry from ${body.name}`,
        html: `
          <p><strong>Name:</strong> ${body.name}</p>
          <p><strong>Email:</strong> ${body.email}</p>
          <p><strong>Phone:</strong> ${body.phone || "—"}</p>
          <p><strong>Message:</strong></p>
          <p>${body.message.replace(/\n/g, "<br>")}</p>
        `,
      }),
    });

    const data = await res.json().catch(() => ({})) as { id?: string; statusCode?: number; message?: string };

    if (res.ok) return NextResponse.json({ ok: true });

    const error = data.message ?? `Email error ${res.status}`;
    console.error("Resend error:", res.status, data);
    return NextResponse.json({ error }, { status: res.status });
  } catch (err) {
    console.error("Resend fetch error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
