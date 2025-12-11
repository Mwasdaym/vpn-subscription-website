import { type NextRequest, NextResponse } from "next/server"
import { transactions } from "../stk-push/route"

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()

    console.log("PayHero callback received:", data)

    // PayHero callback structure
    const { external_reference, status, message } = data

    if (external_reference && transactions.has(external_reference)) {
      const tx = transactions.get(external_reference)!

      if (status === "SUCCESS" || status === "COMPLETED") {
        tx.status = "COMPLETED"
      } else if (status === "FAILED" || status === "CANCELLED") {
        tx.status = "FAILED"
        tx.message = message || "Payment failed"
      }
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Callback error:", error)
    return NextResponse.json({ error: "Callback processing failed" }, { status: 500 })
  }
}
