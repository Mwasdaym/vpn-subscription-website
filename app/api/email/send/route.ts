import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const { to, subject, body } = await request.json()

    if (!to || !subject || !body) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const EMAIL_USER = process.env.EMAIL_USER
    const EMAIL_PASSWORD = process.env.EMAIL_PASSWORD

    if (!EMAIL_USER || !EMAIL_PASSWORD) {
      console.log("[v0] Email credentials not configured")
      return NextResponse.json(
        { error: "Email not configured. Add EMAIL_USER and EMAIL_PASSWORD in environment variables." },
        { status: 500 },
      )
    }

    // Parse email list (can be comma separated or newline separated)
    const emailList = to
      .split(/[\n,]/)
      .map((email: string) => email.trim())
      .filter((email: string) => email && email.includes("@"))

    if (emailList.length === 0) {
      return NextResponse.json({ error: "No valid email addresses provided" }, { status: 400 })
    }

    // Send emails using Gmail SMTP via fetch to a mail service
    // Using Nodemailer-like approach with Gmail
    const nodemailer = await import("nodemailer")

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: EMAIL_USER,
        pass: EMAIL_PASSWORD,
      },
    })

    const results = []
    const errors = []

    for (const email of emailList) {
      try {
        await transporter.sendMail({
          from: `"ChegeVPN" <${EMAIL_USER}>`,
          to: email,
          subject: subject,
          text: body,
          html: body.replace(/\n/g, "<br>"),
        })
        results.push({ email, status: "sent" })
      } catch (err: any) {
        console.log(`[v0] Failed to send to ${email}:`, err.message)
        errors.push({ email, error: err.message })
      }
    }

    return NextResponse.json({
      success: true,
      sent: results.length,
      failed: errors.length,
      results,
      errors,
    })
  } catch (error: any) {
    console.error("[v0] Email send error:", error)
    return NextResponse.json({ error: error.message || "Failed to send emails" }, { status: 500 })
  }
}
