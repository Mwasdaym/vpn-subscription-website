import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  const reference = request.nextUrl.searchParams.get("reference")
  const externalRef = request.nextUrl.searchParams.get("externalRef")

  if (!reference) {
    return NextResponse.json({ error: "Reference required" }, { status: 400 })
  }

  const apiUsername = process.env.PAYHERO_API_USERNAME
  const apiPassword = process.env.PAYHERO_API_PASSWORD

  if (!apiUsername || !apiPassword) {
    console.log("[v0] PayHero credentials not configured")
    return NextResponse.json(
      {
        error: "Payment service not configured",
      },
      { status: 500 },
    )
  }

  try {
    const authString = Buffer.from(`${apiUsername}:${apiPassword}`).toString("base64")

    console.log("[v0] Checking payment status for reference:", reference)

    let data: any = null
    let success = false

    // Try transaction-status endpoint first
    try {
      const response = await fetch(
        `https://backend.payhero.co.ke/api/v2/transaction-status?reference=${encodeURIComponent(reference)}`,
        {
          method: "GET",
          headers: {
            Authorization: `Basic ${authString}`,
          },
        },
      )

      if (response.ok) {
        data = await response.json()
        success = true
        console.log("[v0] PayHero transaction-status response:", data)
      }
    } catch (e) {
      console.log("[v0] transaction-status endpoint failed, trying alternative")
    }

    if (!success) {
      try {
        const response = await fetch(
          `https://backend.payhero.co.ke/api/v2/payments?reference=${encodeURIComponent(reference)}`,
          {
            method: "GET",
            headers: {
              Authorization: `Basic ${authString}`,
            },
          },
        )

        if (response.ok) {
          data = await response.json()
          success = true
          console.log("[v0] PayHero payments response:", data)
        }
      } catch (e) {
        console.log("[v0] payments endpoint also failed")
      }
    }

    if (!success && externalRef && externalRef !== reference) {
      try {
        const response = await fetch(
          `https://backend.payhero.co.ke/api/v2/transaction-status?reference=${encodeURIComponent(externalRef)}`,
          {
            method: "GET",
            headers: {
              Authorization: `Basic ${authString}`,
            },
          },
        )

        if (response.ok) {
          data = await response.json()
          success = true
          console.log("[v0] PayHero external ref response:", data)
        }
      } catch (e) {
        console.log("[v0] external ref lookup failed")
      }
    }

    if (!success || !data) {
      // Transaction might still be processing
      return NextResponse.json({
        status: "PENDING",
        message: "Payment is being processed. Please wait...",
        isProcessing: true,
      })
    }

    const payheroStatus = (data.status || data.payment_status || data.state || "PENDING").toUpperCase()

    console.log("[v0] PayHero status:", payheroStatus)

    let status: "PENDING" | "COMPLETED" | "FAILED" = "PENDING"
    let message = "Processing payment..."
    let isProcessing = true

    if (payheroStatus === "SUCCESS" || payheroStatus === "SUCCESSFUL" || payheroStatus === "COMPLETED") {
      status = "COMPLETED"
      message = "Payment successful!"
      isProcessing = false
    } else if (payheroStatus === "FAILED" || payheroStatus === "CANCELLED" || payheroStatus === "REJECTED") {
      status = "FAILED"
      message = `Payment ${payheroStatus.toLowerCase()}. Please try again.`
      isProcessing = false
    } else if (payheroStatus === "QUEUED") {
      status = "PENDING"
      message = "Waiting for you to enter M-Pesa PIN..."
      isProcessing = true
    } else if (payheroStatus === "PENDING" || payheroStatus === "PROCESSING" || payheroStatus === "INITIATED") {
      status = "PENDING"
      message = "Payment is being processed..."
      isProcessing = true
    }

    return NextResponse.json({
      status,
      message,
      isProcessing,
      payheroStatus,
    })
  } catch (error) {
    console.error("[v0] Status check error:", error)
    return NextResponse.json({
      status: "PENDING",
      message: "Checking payment status...",
      isProcessing: true,
    })
  }
}
