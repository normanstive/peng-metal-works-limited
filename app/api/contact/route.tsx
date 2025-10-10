import { NextResponse } from "next/server"
import { Resend } from "resend"

// Initialize Resend with API key from environment variables
const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(request: Request) {
  console.log("[v0] Contact API route called")

  try {
    // Parse the request body
    const body = await request.json()
    console.log("[v0] Received form data:", body)

    const { name, email, phone, service, message } = body

    // Validate required fields
    if (!name || !email || !phone || !service || !message) {
      console.log("[v0] Validation failed - missing required fields")
      return NextResponse.json({ error: "All fields are required" }, { status: 400 })
    }

    // Check if RESEND_API_KEY is configured
    if (!process.env.RESEND_API_KEY) {
      console.error("[v0] RESEND_API_KEY is not configured in environment variables")
      return NextResponse.json({ error: "Email service not configured" }, { status: 500 })
    }

    console.log("[v0] Attempting to send email via Resend...")

    // Send email using Resend
    const { data, error } = await resend.emails.send({
      from: "PMWL Contact Form <onboarding@resend.dev>", // Resend's test domain
      to: ["Pengmetals@gmail.com"],
      replyTo: email, // User's email for easy replies
      subject: `New Contact Form Submission - ${service}`,
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <style>
              body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
              .container { max-width: 600px; margin: 0 auto; padding: 20px; }
              .header { background: linear-gradient(135deg, #1e40af 0%, #3b82f6 100%); color: white; padding: 20px; border-radius: 8px 8px 0 0; }
              .content { background: #f9fafb; padding: 30px; border: 1px solid #e5e7eb; border-radius: 0 0 8px 8px; }
              .field { margin-bottom: 20px; }
              .label { font-weight: bold; color: #1e40af; display: block; margin-bottom: 5px; }
              .value { background: white; padding: 10px; border-radius: 4px; border: 1px solid #e5e7eb; }
              .footer { margin-top: 20px; padding-top: 20px; border-top: 2px solid #fbbf24; color: #6b7280; font-size: 14px; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1 style="margin: 0;">New Contact Form Submission</h1>
                <p style="margin: 5px 0 0 0; opacity: 0.9;">Peng Metal Works Limited</p>
              </div>
              <div class="content">
                <div class="field">
                  <span class="label">Name:</span>
                  <div class="value">${name}</div>
                </div>
                <div class="field">
                  <span class="label">Email:</span>
                  <div class="value"><a href="mailto:${email}">${email}</a></div>
                </div>
                <div class="field">
                  <span class="label">Phone:</span>
                  <div class="value"><a href="tel:${phone}">${phone}</a></div>
                </div>
                <div class="field">
                  <span class="label">Service Requested:</span>
                  <div class="value">${service}</div>
                </div>
                <div class="field">
                  <span class="label">Project Details:</span>
                  <div class="value">${message.replace(/\n/g, "<br>")}</div>
                </div>
                <div class="footer">
                  <p><strong>Quick Actions:</strong></p>
                  <p>Reply directly to this email to respond to ${name}</p>
                  <p>Or call them at: ${phone}</p>
                </div>
              </div>
            </div>
          </body>
        </html>
      `,
    })

    if (error) {
      console.error("[v0] Resend API error:", error)
      return NextResponse.json({ error: "Failed to send email", details: error }, { status: 500 })
    }

    console.log("[v0] Email sent successfully! Email ID:", data?.id)

    return NextResponse.json(
      {
        success: true,
        message: "Contact form submitted successfully",
        emailId: data?.id,
      },
      { status: 200 },
    )
  } catch (error) {
    console.error("[v0] Unexpected error in contact API:", error)
    return NextResponse.json(
      {
        error: "Internal server error",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
