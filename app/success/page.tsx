"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { CheckCircle, MessageCircle, Send } from "lucide-react"

interface TransactionData {
  reference: string
  appName: string
  planName: string
  duration: string
  phone: string
}

export default function SuccessPage() {
  const [transaction, setTransaction] = useState<TransactionData | null>(null)

  useEffect(() => {
    const stored = sessionStorage.getItem("vpn_transaction")
    if (stored) {
      setTransaction(JSON.parse(stored))
    }
  }, [])

  const whatsappNumber = "254781287381" // Replace with your actual WhatsApp number
  const telegramUsername = "chegeez_1" // Replace with your actual Telegram username

  const getMessage = () => {
    if (!transaction) return ""
    return encodeURIComponent(
      `Hi! I just paid for ${transaction.appName} - ${transaction.planName} (${transaction.duration}).\n\nReference: ${transaction.reference}\nPhone: ${transaction.phone}\n\nPlease send my config file.`,
    )
  }

  return (
    <main className="min-h-screen bg-background relative flex items-center justify-center">
      {/* Background effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 via-transparent to-cyan-500/10" />
      <div className="absolute top-40 left-20 w-72 h-72 bg-green-500/10 rounded-full blur-3xl" />
      <div className="absolute bottom-40 right-20 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl" />

      <div className="relative z-10 container mx-auto px-4 py-12">
        <div className="max-w-md mx-auto text-center">
          {/* Success Icon */}
          <div className="w-24 h-24 rounded-full bg-gradient-to-br from-green-500/20 to-green-500/10 flex items-center justify-center mx-auto mb-6 animate-pulse">
            <CheckCircle className="w-12 h-12 text-green-500" />
          </div>

          <h1 className="text-3xl font-bold text-foreground mb-4">Payment Successful!</h1>
          <p className="text-muted-foreground mb-8">
            Thank you for your purchase. Choose how you&apos;d like to receive your VPN config file.
          </p>

          {transaction && (
            <div className="p-4 rounded-xl bg-card/30 backdrop-blur-md border border-border/50 mb-8 text-left">
              <h3 className="font-semibold text-foreground mb-2">Order Details</h3>
              <div className="space-y-1 text-sm text-muted-foreground">
                <p>
                  App: <span className="text-foreground">{transaction.appName}</span>
                </p>
                <p>
                  Plan: <span className="text-foreground">{transaction.planName}</span>
                </p>
                <p>
                  Duration: <span className="text-foreground">{transaction.duration}</span>
                </p>
                <p>
                  Reference: <span className="text-cyan-400 font-mono text-xs">{transaction.reference}</span>
                </p>
              </div>
            </div>
          )}

          <h2 className="text-lg font-semibold text-foreground mb-4">Get Your Config File</h2>

          <div className="grid grid-cols-2 gap-4">
            <a
              href={`https://wa.me/${whatsappNumber}?text=${getMessage()}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col items-center gap-3 p-6 rounded-2xl bg-green-500/10 border border-green-500/30 hover:border-green-500/50 hover:bg-green-500/20 transition-all"
            >
              <div className="w-14 h-14 rounded-xl bg-green-500 flex items-center justify-center">
                <MessageCircle className="w-7 h-7 text-white" />
              </div>
              <span className="font-semibold text-foreground">WhatsApp</span>
              <span className="text-xs text-muted-foreground">Chat with us</span>
            </a>

            <a
              href={`https://t.me/${telegramUsername}?start=${transaction?.reference || ""}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col items-center gap-3 p-6 rounded-2xl bg-blue-500/10 border border-blue-500/30 hover:border-blue-500/50 hover:bg-blue-500/20 transition-all"
            >
              <div className="w-14 h-14 rounded-xl bg-blue-500 flex items-center justify-center">
                <Send className="w-7 h-7 text-white" />
              </div>
              <span className="font-semibold text-foreground">Telegram</span>
              <span className="text-xs text-muted-foreground">Message our bot</span>
            </a>
          </div>

          <Link href="/" className="inline-block mt-8 text-muted-foreground hover:text-foreground transition-colors">
            ← Back to Home
          </Link>
        </div>
      </div>
    </main>
  )
}
