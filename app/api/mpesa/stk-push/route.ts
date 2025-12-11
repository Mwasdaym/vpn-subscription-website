import { type NextRequest, NextResponse } from "next/server"

// In-memory storage for transactions (in production, use a database)
const transactions = new Map<
  string,
  {
    status: "PENDING" | "COMPLETED" | "FAILED"
    message?: string
    appId: string
    appName: string
    planId: string
    planName: string
    phone: string
    amount: number
  }
>()

// Make transactions accessible to status endpoint
export { transactions }

export async function POST(request: NextRequest) {
  try {
    const { phone, amount, appId, appName, planId, planName, duration, hwid } = await request.json()

    // Convert phone to international format (254...)
    let formattedPhone = phone.replace(/\s/g, "")
    if (formattedPhone.startsWith("+")) {
      formattedPhone = formattedPhone.slice(1)
    }
    if (formattedPhone.startsWith("0")) {
      formattedPhone = "254" + formattedPhone.slice(1)
    }

    // Generate unique reference
    const reference = `VPN-${Date.now()}-${Math.random().toString(36).slice(2, 8).toUpperCase()}`

    // PayHero API credentials from environment
    const apiUsername = process.env.PAYHERO_API_USERNAME
    const apiPassword = process.env.PAYHERO_API_PASSWORD
    const channelId = process.env.PAYHERO_CHANNEL_ID

    if (!apiUsername || !apiPassword || !channelId) {
      console.log("[v0] PayHero credentials not configured")
      return NextResponse.json(
        {
          error: "Payment service not configured. Please add PayHero credentials.",
        },
        { status: 500 },
      )
    }

    // Real PayHero STK Push request
    const authString = Buffer.from(`${apiUsername}:${apiPassword}`).toString("base64")

    console.log("[v0] Initiating STK Push for:", { phone: formattedPhone, amount, reference })

    const response = await fetch("https://backend.payhero.co.ke/api/v2/payments", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Basic ${authString}`,
      },
      body: JSON.stringify({
        amount: amount,
        phone_number: formattedPhone,
        channel_id: Number.parseInt(channelId),
        provider: "m-pesa",
        external_reference: reference,
        callback_url: `${process.env.NEXT_PUBLIC_BASE_URL || "https://your-domain.com"}/api/mpesa/callback`,
        description: `${appName} - ${planName} (${duration})`,
      }),
    })

    const data = await response.json()

    console.log("[v0] PayHero STK Push response:", data)

    if (!response.ok) {
      console.error("[v0] PayHero error:", data)
      return NextResponse.json({ error: data.message || "Failed to initiate payment" }, { status: 400 })
    }

    // Store transaction
    transactions.set(reference, {
      status: "PENDING",
      appId,
      appName,
      planId,
      planName,
      phone: formattedPhone,
      amount,
    })

    return NextResponse.json({
      success: true,
      reference,
      payheroReference: data.reference || data.id || reference,
      message: "STK Push sent to your phone",
    })
  } catch (error) {
    console.error("[v0] STK Push error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
