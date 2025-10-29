import { Resend } from "resend"

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { name, email, phone, service, message } = body

    console.log("[v0] Form submission received:", { name, email, phone, service, message })

    // Validate required fields
    if (!name || !email || !message) {
      console.log("[v0] Validation failed - missing required fields")
      return Response.json({ error: "Please fill in all required fields" }, { status: 400 })
    }

    // Include customer email in the body so you can see who submitted
    const result = await resend.emails.send({
      from: "onboarding@resend.dev", // Resend test email
      to: "njorogenorman99@gmail.com", // Your Resend account email
      subject: `New Contact Form Submission from ${name}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #0066CC;">New Contact Form Submission</h2>
          
          <div style="background-color: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Phone:</strong> ${phone || "Not provided"}</p>
            <p><strong>Service:</strong> ${service || "Not specified"}</p>
          </div>
          
          <div style="margin: 20px 0;">
            <h3 style="color: #0066CC;">Message:</h3>
            <p style="white-space: pre-wrap; line-height: 1.6;">${message}</p>
          </div>
          
          <div style="border-top: 2px solid #FFC107; padding-top: 20px; margin-top: 30px;">
            <p style="color: #666; font-size: 12px;">
              This is an automated email from your PMWL website contact form.
            </p>
            <p style="color: #666; font-size: 12px;">
              <strong>To reply to this customer:</strong> Send an email to ${email}
            </p>
          </div>
        </div>
      `,
    })

    console.log("[v0] Email sent successfully:", result)

    return Response.json(
      {
        success: true,
        message: "Your request has been submitted successfully! We will get back to you soon.",
        data: result,
      },
      { status: 200 },
    )
  } catch (error) {
    console.error("[v0] Error sending email:", error)

    return Response.json(
      {
        error: "Failed to submit your request. Please try again later.",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
