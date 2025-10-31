import { NextResponse } from "next/server";

export async function POST(request: Request) {
  console.log("🐛 Contact form hit!");

  try {
    const body = await request.json();
    const { name, email, phone, service, message } = body;

    // ✅ Validate
    if (!name || !email || !service || !message) {
      return NextResponse.json({ success: false, error: "Fill all fields!" }, { status: 400 });
    }

    // ✅ SEND EMAIL (NO SDK NEEDED!)
    const emailRes = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: "Peng MW <onboarding@resend.dev>",
        to: "njorogenorman99@gmail.com",
        reply_to: email,
        subject: `🛠️ New Lead: ${service}`,
        html: `
          <h1>🚀 New Contact!</h1>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Phone:</strong> ${phone || 'N/A'}</p>
          <p><strong>Service:</strong> ${service}</p>
          <p><strong>Message:</strong><br>${message.replace(/\n/g, '<br>')}</p>
          <hr>
          <p><em>Reply NOW! 🎯</em></p>
        `,
      }),
    });

    const data = await emailRes.json();

    if (!emailRes.ok) {
      console.error("❌ Resend failed:", data);
      return NextResponse.json({ success: false, error: "Email failed. Try again!" }, { status: 500 });
    }

    console.log("✅ EMAIL SENT! ID:", data.id);
    return NextResponse.json({ success: true, message: "Sent! We'll reply FAST 🚀" });

  } catch (err: any) {
    console.error("💥 ERROR:", err);
    return NextResponse.json({ success: false, error: "Server oops!" }, { status: 500 });
  }
}