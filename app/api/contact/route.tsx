import { NextResponse } from "next/server"
import { Resend } from "resend"

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(request: Request) {
  console.log("[v0] Contact form API called")

  try {
    const body = await request.json()
    console.log("[v0] Form data received:", body)

    const { name, email, phone, service, message } = body

    // Validate required fields
    if (!name || !email || !phone || !service || !message) {
      console.log("[v0] Missing required fields")
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    console.log("[v0] Attempting to send email...")

    // Send email using Resend
    const { data, error } = await resend.emails.send({
      from: "PMWL Contact Form <onboarding@resend.dev>", // Use Resend's test domain
      to: ["Pengmetals@gmail.com"],
      replyTo: email,
      subject: `New Contact Form Submission - ${service}`,
      html: `
        <h2>New Contact Form Submission</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Phone:</strong> ${phone}</p>
        <p><strong>Service:</strong> ${service}</p>
        <p><strong>Message:</strong></p>
        <p>${message}</p>
        <hr>
        <p><em>You can reply directly to this email to respond to ${name}</em></p>
      `,
    })

    if (error) {
      console.error("[v0] Resend error:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    console.log("[v0] Email sent successfully:", data)
    return NextResponse.json({ success: true, data }, { status: 200 })
  } catch (error) {
    console.error("[v0] API error:", error)
    return NextResponse.json({ error: "Failed to process request" }, { status: 500 })
  }
}
