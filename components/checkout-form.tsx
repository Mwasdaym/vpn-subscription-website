"use client"

import type React from "react"

import { useState, useEffect, useRef, useCallback } from "react"
import { Loader2, Phone, Tag, X, Check, Fingerprint, CheckCircle, MessageCircle, Send, Mail, Gift } from "lucide-react"
import { validatePromoCode } from "@/lib/promo-codes"
import { createClient } from "@/lib/supabase/client"

interface CheckoutFormProps {
  appId: string
  appName: string
  planId: string
  planName: string
  price: number
  duration: string
}

export default function CheckoutForm({ appId, appName, planId, planName, price, duration }: CheckoutFormProps) {
  const [phone, setPhone] = useState("")
  const [email, setEmail] = useState("")
  const [hwid, setHwid] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [status, setStatus] = useState<"idle" | "pending" | "checking" | "success">("idle")
  const [countdown, setCountdown] = useState(5)
  const [reference, setReference] = useState("")
  const [whatsappUrl, setWhatsappUrl] = useState("")
  const hasRedirected = useRef(false)

  const [promoCode, setPromoCode] = useState("")
  const [promoApplied, setPromoApplied] = useState(false)
  const [promoDiscount, setPromoDiscount] = useState(0)
  const [promoMessage, setPromoMessage] = useState("")
  const [promoError, setPromoError] = useState("")

  const [referralCode, setReferralCode] = useState("")

  const finalPrice = price - promoDiscount
  const whatsappNumber = "254781287381"
  const telegramUsername = "chegeez_1"

  const truncatedHwid = hwid.length > 100 ? hwid.slice(0, 100) + "..." : hwid

  const getWhatsAppUrl = useCallback(
    (ref: string, hwidValue: string, phoneValue: string) => {
      const safeHwid = hwidValue.length > 100 ? hwidValue.slice(0, 100) : hwidValue
      const message = encodeURIComponent(
        `Hi! I paid for ${appName} - ${planName} (${duration}).\n\nAmount: KSH ${finalPrice}\nHWID: ${safeHwid}\nRef: ${ref}\n\nPlease send my config.`,
      )
      return `https://wa.me/${whatsappNumber}?text=${message}`
    },
    [appName, planName, duration, finalPrice, whatsappNumber],
  )

  const getTelegramUrl = useCallback(
    (ref: string, hwidValue: string) => {
      const safeHwid = hwidValue.length > 100 ? hwidValue.slice(0, 100) : hwidValue
      const message = encodeURIComponent(
        `Hi! I paid for ${appName} - ${planName} (${duration}).\n\nAmount: KSH ${finalPrice}\nHWID: ${safeHwid}\nRef: ${ref}\n\nPlease send my config.`,
      )
      return `https://t.me/${telegramUsername}?text=${message}`
    },
    [appName, planName, duration, finalPrice, telegramUsername],
  )

  useEffect(() => {
    if (status === "success" && whatsappUrl && !hasRedirected.current) {
      console.log("[v0] Payment success detected, starting countdown")
      console.log("[v0] WhatsApp URL:", whatsappUrl)

      const timer = setInterval(() => {
        setCountdown((prev) => {
          console.log("[v0] Countdown:", prev)
          if (prev <= 1) {
            clearInterval(timer)
            if (!hasRedirected.current) {
              hasRedirected.current = true
              console.log("[v0] Redirecting to WhatsApp now")
              window.location.href = whatsappUrl
            }
            return 0
          }
          return prev - 1
        })
      }, 1000)

      return () => {
        console.log("[v0] Cleaning up timer")
        clearInterval(timer)
      }
    }
  }, [status, whatsappUrl])

  const formatPhone = (value: string) => {
    const digits = value.replace(/\D/g, "")
    if (digits.length <= 4) return digits
    if (digits.length <= 7) return `${digits.slice(0, 4)} ${digits.slice(4)}`
    return `${digits.slice(0, 4)} ${digits.slice(4, 7)} ${digits.slice(7, 10)}`
  }

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value

    // Allow + at the beginning for international format
    if (value.startsWith("+")) {
      const digits = value.slice(1).replace(/\D/g, "")
      if (digits.length <= 12) {
        // Format: +254 7XX XXX XXX
        if (digits.length <= 3) {
          setPhone("+" + digits)
        } else if (digits.length <= 6) {
          setPhone("+" + digits.slice(0, 3) + " " + digits.slice(3))
        } else if (digits.length <= 9) {
          setPhone("+" + digits.slice(0, 3) + " " + digits.slice(3, 6) + " " + digits.slice(6))
        } else {
          setPhone(
            "+" + digits.slice(0, 3) + " " + digits.slice(3, 6) + " " + digits.slice(6, 9) + " " + digits.slice(9, 12),
          )
        }
      }
    } else {
      // Local format: 07XX or 011X
      const formatted = formatPhone(value)
      if (formatted.replace(/\s/g, "").length <= 10) {
        setPhone(formatted)
      }
    }
  }

  const handleApplyPromo = () => {
    if (!promoCode.trim()) {
      setPromoError("Please enter a promo code")
      return
    }

    const result = validatePromoCode(promoCode, price, appId, planId)

    if (result.valid) {
      setPromoApplied(true)
      setPromoDiscount(result.discount)
      setPromoMessage(result.message)
      setPromoError("")
    } else {
      setPromoError(result.message)
      setPromoApplied(false)
      setPromoDiscount(0)
      setPromoMessage("")
    }
  }

  const handleRemovePromo = () => {
    setPromoCode("")
    setPromoApplied(false)
    setPromoDiscount(0)
    setPromoMessage("")
    setPromoError("")
  }

  const redirectToWhatsApp = () => {
    if (whatsappUrl) {
      hasRedirected.current = true
      console.log("[v0] Manual redirect to WhatsApp:", whatsappUrl)
      window.location.href = whatsappUrl
    }
  }

  const startCountdownAndRedirect = (ref: string, hwidValue: string, phoneValue: string) => {
    const url = getWhatsAppUrl(ref, hwidValue, phoneValue)
    console.log("[v0] Setting up redirect with URL:", url)
    setWhatsappUrl(url)
    setStatus("success")
    setReference(ref)
    setCountdown(5)
    hasRedirected.current = false
  }

  const sendOrderNotification = async (reference: string, cleanPhone: string) => {
    const safeHwid = hwid.length > 100 ? hwid.slice(0, 100) + "..." : hwid
    const message = `🛒 <b>NEW ORDER</b> 🛒

📱 <b>App:</b> ${appName}
📦 <b>Plan:</b> ${planName}
⏱ <b>Duration:</b> ${duration}
💰 <b>Amount:</b> KSH ${finalPrice}${promoDiscount > 0 ? ` (Discount: KSH ${promoDiscount})` : ""}

🔑 <b>HWID:</b> <code>${safeHwid}</code>
👤 <b>Phone:</b> ${cleanPhone}
📧 <b>Email:</b> ${email || "Not provided"}
🔖 <b>Ref:</b> ${reference}`

    try {
      await fetch("/api/telegram/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message, type: "order" }),
      })
    } catch (error) {
      console.error("Failed to send order notification:", error)
    }
  }

  const saveCustomerData = async (reference: string, cleanPhone: string) => {
    try {
      const supabase = createClient()

      // Calculate expiry date based on duration
      const now = new Date()
      const expiresAt = new Date()

      if (duration.includes("24")) expiresAt.setDate(now.getDate() + 1)
      else if (duration.includes("3 Days")) expiresAt.setDate(now.getDate() + 3)
      else if (duration.includes("7 Days") || duration.includes("Week")) expiresAt.setDate(now.getDate() + 7)
      else if (duration.includes("14") || duration.includes("Bi")) expiresAt.setDate(now.getDate() + 14)
      else if (duration.includes("30") || duration.includes("Month")) expiresAt.setDate(now.getDate() + 30)
      else expiresAt.setDate(now.getDate() + 1) // Default to 1 day

      const { error } = await supabase.from("customers").insert({
        email: email || null,
        phone: cleanPhone,
        hwid,
        app_name: appName,
        plan_name: planName,
        duration,
        amount: finalPrice,
        reference,
        referral_code_used: referralCode || null,
        expires_at: expiresAt.toISOString(),
      })

      if (error) {
        console.error("[v0] Failed to save customer data:", error)
      } else {
        console.log("[v0] Customer data saved successfully")

        // If referral code was used, increment successful referrals
        if (referralCode) {
          const { error: refError } = await supabase.rpc("increment_referral", { ref_code: referralCode.toUpperCase() })
          if (refError) {
            // Fallback: manual increment
            const { data: refData } = await supabase
              .from("referrals")
              .select("successful_referrals")
              .eq("code", referralCode.toUpperCase())
              .single()

            if (refData) {
              await supabase
                .from("referrals")
                .update({ successful_referrals: refData.successful_referrals + 1 })
                .eq("code", referralCode.toUpperCase())
            }
          }
        }
      }
    } catch (error) {
      console.error("[v0] Error saving customer data:", error)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    let cleanPhone = phone.replace(/\s/g, "")

    // Convert +254 to 0 format for API
    if (cleanPhone.startsWith("+254")) {
      cleanPhone = "0" + cleanPhone.slice(4)
    }

    // Validate: must be 07XX or 011X format (10 digits starting with 07 or 011)
    if (!/^(07\d{8}|011\d{7})$/.test(cleanPhone)) {
      setError("Please enter a valid phone number (07XX, 011X, or +254)")
      return
    }

    if (!hwid.trim()) {
      setError("Please enter your HWID from the VPN app")
      return
    }

    setLoading(true)
    setStatus("pending")

    try {
      const response = await fetch("/api/mpesa/stk-push", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          phone: cleanPhone,
          amount: finalPrice,
          appId,
          appName,
          planId,
          planName,
          duration,
          hwid,
          promoCode: promoApplied ? promoCode : undefined,
          email: email || undefined,
          referralCode: referralCode || undefined,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Payment initiation failed")
      }

      const statusReference = data.payheroReference || data.reference
      console.log("[v0] STK Push initiated, reference:", data.reference, "payheroReference:", statusReference)

      setStatus("checking")

      const checkPayment = async (attempts = 0): Promise<void> => {
        if (attempts >= 40) {
          throw new Error("Payment verification timed out. Check your M-Pesa messages.")
        }

        console.log("[v0] Checking payment status, attempt:", attempts + 1)

        const statusRes = await fetch(`/api/mpesa/status?reference=${statusReference}&externalRef=${data.reference}`)
        const statusData = await statusRes.json()

        console.log("[v0] Status response:", statusData)

        if (statusData.status === "COMPLETED") {
          console.log("[v0] Payment completed!")
          await saveCustomerData(data.reference, cleanPhone)
          await sendOrderNotification(data.reference, cleanPhone)
          setLoading(false)
          startCountdownAndRedirect(data.reference, hwid, phone)
          return
        } else if (statusData.status === "FAILED") {
          throw new Error(statusData.message || "Payment was not completed")
        }

        await new Promise((resolve) => setTimeout(resolve, 4000))
        return checkPayment(attempts + 1)
      }

      await checkPayment()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong")
      setStatus("idle")
      setLoading(false)
    }
  }

  if (status === "success") {
    const telegramUrl = getTelegramUrl(reference, hwid)

    return (
      <div className="p-6 rounded-2xl bg-card/30 backdrop-blur-md border border-green-500/50">
        <div className="text-center">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-green-500/20 to-green-500/10 flex items-center justify-center mx-auto mb-4 animate-pulse">
            <CheckCircle className="w-10 h-10 text-green-500" />
          </div>

          <h2 className="text-2xl font-bold text-foreground mb-2">Payment Successful!</h2>
          <p className="text-muted-foreground mb-6">Your payment has been received.</p>

          <div className="p-4 rounded-xl bg-background/30 border border-border/50 mb-6 text-left">
            <h3 className="font-semibold text-foreground mb-2">Order Details</h3>
            <div className="space-y-1 text-sm text-muted-foreground">
              <p>
                App: <span className="text-foreground">{appName}</span>
              </p>
              <p>
                Plan: <span className="text-foreground">{planName}</span>
              </p>
              <p>
                Duration: <span className="text-foreground">{duration}</span>
              </p>
              <p>
                Amount: <span className="text-green-400 font-semibold">KSH {finalPrice}</span>
              </p>
              <p>
                HWID: <span className="text-cyan-400 font-mono text-xs break-all">{truncatedHwid}</span>
              </p>
              <p>
                Reference: <span className="text-cyan-400 font-mono text-xs">{reference}</span>
              </p>
              <p>
                Email: <span className="text-cyan-400 font-mono text-xs">{email || "Not provided"}</span>
              </p>
            </div>
          </div>

          <p className="text-sm text-muted-foreground mb-4">Choose how to receive your config file:</p>

          <div className="flex flex-col gap-3">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-4 rounded-xl bg-gradient-to-r from-green-500 to-green-600 text-white font-semibold hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
            >
              <MessageCircle className="w-5 h-5" />
              Open WhatsApp
            </a>

            <a
              href={telegramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-4 rounded-xl bg-gradient-to-r from-blue-500 to-blue-600 text-white font-semibold hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
            >
              <Send className="w-5 h-5" />
              Open Telegram
            </a>
          </div>

          <p className="text-xs text-muted-foreground mt-4">
            Click either button to send your order details and receive your config file.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 rounded-2xl bg-card/30 backdrop-blur-md border border-border/50">
      <h2 className="text-lg font-semibold text-foreground mb-2">Pay with M-Pesa</h2>
      <p className="text-sm text-muted-foreground mb-6">Enter your details to receive the STK push</p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-foreground mb-2">
            Email Address (Optional)
          </label>
          <div className="relative">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              className="w-full pl-12 pr-4 py-3 rounded-xl bg-background/50 border border-border focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500 text-foreground placeholder:text-muted-foreground"
              disabled={loading}
            />
          </div>
          <p className="text-xs text-muted-foreground mt-1">For expiry reminders and promo offers</p>
        </div>

        <div>
          <label htmlFor="hwid" className="block text-sm font-medium text-foreground mb-2">
            HWID (Hardware ID)
          </label>
          <div className="relative">
            <Fingerprint className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <input
              type="text"
              id="hwid"
              value={hwid}
              onChange={(e) => setHwid(e.target.value)}
              maxLength={100}
              placeholder="Paste your HWID from the VPN app"
              className="w-full pl-12 pr-4 py-3 rounded-xl bg-background/50 border border-border focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500 text-foreground placeholder:text-muted-foreground font-mono text-sm"
              disabled={loading}
            />
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            {hwid.length}/100 characters - Find HWID in VPN app settings
          </p>
        </div>

        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-foreground mb-2">
            Phone Number
          </label>
          <div className="relative">
            <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <input
              type="tel"
              id="phone"
              value={phone}
              onChange={handlePhoneChange}
              placeholder="0712 345 678"
              className="w-full pl-12 pr-4 py-3 rounded-xl bg-background/50 border border-border focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500 text-foreground placeholder:text-muted-foreground"
              disabled={loading}
            />
          </div>
        </div>

        <div>
          <label htmlFor="referral" className="block text-sm font-medium text-foreground mb-2">
            Referral Code (Optional)
          </label>
          <div className="relative">
            <Gift className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <input
              type="text"
              id="referral"
              value={referralCode}
              onChange={(e) => setReferralCode(e.target.value.toUpperCase())}
              placeholder="Enter referral code"
              className="w-full pl-12 pr-4 py-3 rounded-xl bg-background/50 border border-border focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500 text-foreground placeholder:text-muted-foreground uppercase"
              disabled={loading}
            />
          </div>
          <p className="text-xs text-muted-foreground mt-1">Have a friend's referral code? Enter it here!</p>
        </div>

        <div>
          <label htmlFor="promo" className="block text-sm font-medium text-foreground mb-2">
            Promo Code (Optional)
          </label>
          {promoApplied ? (
            <div className="flex items-center justify-between p-3 rounded-xl bg-green-500/10 border border-green-500/50">
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-green-400" />
                <span className="text-green-400 text-sm font-medium">{promoMessage}</span>
              </div>
              <button
                type="button"
                onClick={handleRemovePromo}
                className="text-muted-foreground hover:text-foreground"
                disabled={loading}
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Tag className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input
                  type="text"
                  id="promo"
                  value={promoCode}
                  onChange={(e) => {
                    setPromoCode(e.target.value.toUpperCase())
                    setPromoError("")
                  }}
                  placeholder="Enter code"
                  className="w-full pl-12 pr-4 py-3 rounded-xl bg-background/50 border border-border focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500 text-foreground placeholder:text-muted-foreground uppercase"
                  disabled={loading}
                />
              </div>
              <button
                type="button"
                onClick={handleApplyPromo}
                className="px-4 py-3 rounded-xl bg-card border border-border hover:border-cyan-500/50 text-foreground font-medium transition-colors"
                disabled={loading}
              >
                Apply
              </button>
            </div>
          )}
          {promoError && <p className="text-red-400 text-sm mt-2">{promoError}</p>}
        </div>

        {promoApplied && (
          <div className="p-4 rounded-xl bg-background/30 border border-border/50 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Original Price</span>
              <span className="text-muted-foreground line-through">KSH {price}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-green-400">Discount</span>
              <span className="text-green-400">- KSH {promoDiscount}</span>
            </div>
            <div className="flex justify-between text-lg font-semibold border-t border-border/50 pt-2">
              <span className="text-foreground">Total</span>
              <span className="text-cyan-400">KSH {finalPrice}</span>
            </div>
          </div>
        )}

        {error && (
          <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/50 text-red-400 text-sm">{error}</div>
        )}

        {status === "pending" && (
          <div className="p-3 rounded-lg bg-cyan-500/10 border border-cyan-500/50 text-cyan-400 text-sm">
            STK Push sent! Check your phone and enter your M-Pesa PIN.
          </div>
        )}

        {status === "checking" && (
          <div className="p-3 rounded-lg bg-yellow-500/10 border border-yellow-500/50 text-yellow-400 text-sm">
            Verifying payment... Please wait.
          </div>
        )}

        <button
          type="submit"
          disabled={loading || !phone || !hwid}
          className="w-full py-4 rounded-xl bg-gradient-to-r from-green-500 to-green-600 text-white font-semibold hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              {status === "pending" ? "Waiting for PIN..." : "Verifying..."}
            </>
          ) : (
            <>Pay KSH {finalPrice} with M-Pesa</>
          )}
        </button>

        <p className="text-xs text-muted-foreground text-center">
          You will receive an M-Pesa prompt on your phone. Enter your PIN to complete payment.
        </p>
      </form>
    </div>
  )
}
