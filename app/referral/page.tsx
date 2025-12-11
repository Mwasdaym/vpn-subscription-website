"use client"

import type React from "react"

import { useState } from "react"
import { Gift, Copy, Check, Users, Award, Phone, Mail, Loader2 } from "lucide-react"
import Link from "next/link"
import { createClient } from "@/lib/supabase/client"

export default function ReferralPage() {
  const [phone, setPhone] = useState("")
  const [email, setEmail] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [referralCode, setReferralCode] = useState("")
  const [existingCode, setExistingCode] = useState<{
    code: string
    successful_referrals: number
    reward_claimed: boolean
  } | null>(null)
  const [copied, setCopied] = useState(false)

  const supabase = createClient()

  const generateCode = () => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
    let code = "REF"
    for (let i = 0; i < 5; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length))
    }
    return code
  }

  const handleCheckOrCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    const cleanPhone = phone.replace(/\s/g, "")
    if (!/^(07\d{8}|011\d{7}|\+254\d{9})$/.test(cleanPhone)) {
      setError("Please enter a valid Kenyan phone number")
      setLoading(false)
      return
    }

    try {
      // Check if user already has a referral code
      const { data: existing } = await supabase.from("referrals").select("*").eq("owner_phone", cleanPhone).single()

      if (existing) {
        setExistingCode(existing)
        setReferralCode(existing.code)
      } else {
        // Create new referral code
        const newCode = generateCode()
        const { data, error: insertError } = await supabase
          .from("referrals")
          .insert({
            code: newCode,
            owner_phone: cleanPhone,
            owner_email: email || null,
          })
          .select()
          .single()

        if (insertError) {
          if (insertError.code === "23505") {
            // Duplicate code, try again
            const retryCode = generateCode()
            const { data: retryData, error: retryError } = await supabase
              .from("referrals")
              .insert({
                code: retryCode,
                owner_phone: cleanPhone,
                owner_email: email || null,
              })
              .select()
              .single()

            if (retryError) throw retryError
            setReferralCode(retryCode)
            setExistingCode(retryData)
          } else {
            throw insertError
          }
        } else {
          setReferralCode(newCode)
          setExistingCode(data)
        }
      }
    } catch (err: any) {
      setError(err.message || "Something went wrong")
    } finally {
      setLoading(false)
    }
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(referralCode)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleShareWhatsApp = () => {
    const message = encodeURIComponent(
      `Hey! Get cheap VPN configs for HTTP Custom, HTTP Injector & more. Use my referral code ${referralCode} when you purchase. Check it out: ${window.location.origin}`,
    )
    window.open(`https://wa.me/?text=${message}`, "_blank")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-cyan-950/20">
      {/* Header */}
      <header className="border-b border-border/50 backdrop-blur-md bg-background/50 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link
            href="/"
            className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent"
          >
            ChegeVPN
          </Link>
          <Link href="/#plans">
            <button className="px-4 py-2 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-medium hover:opacity-90 transition-opacity">
              Browse Plans
            </button>
          </Link>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/30 mb-6">
            <Gift className="w-4 h-4 text-purple-400" />
            <span className="text-sm text-purple-300">Refer & Earn Free VPN</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Refer 5 Friends,{" "}
            <span className="bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">
              Get 3 Days Free!
            </span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Share your unique referral code with friends. When 5 of them make a purchase, you get a free 3-day VPN
            config!
          </p>
        </div>

        {/* How it Works */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="p-6 rounded-2xl bg-card/30 backdrop-blur-md border border-border/50 text-center">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-cyan-500/20 to-blue-500/20 flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl font-bold text-cyan-400">1</span>
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">Get Your Code</h3>
            <p className="text-muted-foreground text-sm">
              Enter your phone number to generate your unique referral code
            </p>
          </div>
          <div className="p-6 rounded-2xl bg-card/30 backdrop-blur-md border border-border/50 text-center">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-500/20 to-pink-500/20 flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl font-bold text-purple-400">2</span>
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">Share With Friends</h3>
            <p className="text-muted-foreground text-sm">
              Send your code to friends via WhatsApp, Telegram, or any platform
            </p>
          </div>
          <div className="p-6 rounded-2xl bg-card/30 backdrop-blur-md border border-border/50 text-center">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-green-500/20 to-emerald-500/20 flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl font-bold text-green-400">3</span>
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">Earn Free VPN</h3>
            <p className="text-muted-foreground text-sm">After 5 successful referrals, claim your free 3-day config!</p>
          </div>
        </div>

        {/* Get Code Form */}
        <div className="max-w-md mx-auto">
          {!referralCode ? (
            <div className="p-6 rounded-2xl bg-card/30 backdrop-blur-md border border-border/50">
              <h2 className="text-xl font-semibold text-foreground mb-4 text-center">Get Your Referral Code</h2>
              <form onSubmit={handleCheckOrCreate} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Phone Number</label>
                  <div className="relative">
                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="0712 345 678"
                      className="w-full pl-12 pr-4 py-3 rounded-xl bg-background/50 border border-border focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500 text-foreground placeholder:text-muted-foreground"
                      required
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Email (Optional)</label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="your@email.com"
                      className="w-full pl-12 pr-4 py-3 rounded-xl bg-background/50 border border-border focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500 text-foreground placeholder:text-muted-foreground"
                    />
                  </div>
                </div>

                {error && (
                  <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/50 text-red-400 text-sm">
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading || !phone}
                  className="w-full py-4 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Checking...
                    </>
                  ) : (
                    <>
                      <Gift className="w-5 h-5" />
                      Get My Referral Code
                    </>
                  )}
                </button>
              </form>
            </div>
          ) : (
            <div className="p-6 rounded-2xl bg-card/30 backdrop-blur-md border border-purple-500/50">
              <div className="text-center mb-6">
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-purple-500/20 to-pink-500/20 flex items-center justify-center mx-auto mb-4">
                  <Gift className="w-10 h-10 text-purple-400" />
                </div>
                <h2 className="text-xl font-semibold text-foreground mb-2">Your Referral Code</h2>
              </div>

              {/* Referral Code Display */}
              <div className="p-4 rounded-xl bg-background/50 border border-border/50 mb-6">
                <div className="flex items-center justify-between">
                  <span className="text-3xl font-mono font-bold text-purple-400">{referralCode}</span>
                  <button
                    onClick={handleCopy}
                    className="p-2 rounded-lg bg-purple-500/20 hover:bg-purple-500/30 transition-colors"
                  >
                    {copied ? (
                      <Check className="w-5 h-5 text-green-400" />
                    ) : (
                      <Copy className="w-5 h-5 text-purple-400" />
                    )}
                  </button>
                </div>
              </div>

              {/* Progress */}
              {existingCode && (
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-muted-foreground">Referral Progress</span>
                    <span className="text-sm font-semibold text-foreground">{existingCode.successful_referrals}/5</span>
                  </div>
                  <div className="h-3 rounded-full bg-background/50 overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-500"
                      style={{ width: `${(existingCode.successful_referrals / 5) * 100}%` }}
                    />
                  </div>
                  {existingCode.successful_referrals >= 5 && !existingCode.reward_claimed && (
                    <div className="mt-4 p-4 rounded-xl bg-green-500/20 border border-green-500/50">
                      <div className="flex items-center gap-2 text-green-400 mb-2">
                        <Award className="w-5 h-5" />
                        <span className="font-semibold">Reward Available!</span>
                      </div>
                      <p className="text-sm text-green-300">
                        Congratulations! Contact us on WhatsApp or Telegram to claim your free 3-day VPN config.
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* Share Buttons */}
              <div className="space-y-3">
                <button
                  onClick={handleShareWhatsApp}
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-green-500 to-green-600 text-white font-semibold hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
                >
                  <Users className="w-5 h-5" />
                  Share on WhatsApp
                </button>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(
                      `Hey! Get cheap VPN configs. Use my referral code ${referralCode} when you purchase: ${window.location.origin}`,
                    )
                    setCopied(true)
                    setTimeout(() => setCopied(false), 2000)
                  }}
                  className="w-full py-3 rounded-xl bg-card border border-border hover:border-purple-500/50 text-foreground font-medium transition-colors flex items-center justify-center gap-2"
                >
                  <Copy className="w-5 h-5" />
                  Copy Share Message
                </button>
              </div>

              <p className="text-xs text-muted-foreground text-center mt-4">
                Your friends must enter your code during checkout for it to count.
              </p>
            </div>
          )}
        </div>

        {/* Terms */}
        <div className="mt-12 text-center">
          <h3 className="text-lg font-semibold text-foreground mb-4">Referral Program Terms</h3>
          <ul className="text-sm text-muted-foreground space-y-2 max-w-lg mx-auto">
            <li>- Referral code must be entered by your friend during checkout</li>
            <li>- Only completed purchases count as successful referrals</li>
            <li>- Free 3-day config reward after 5 successful referrals</li>
            <li>- Contact support to claim your reward after reaching 5 referrals</li>
            <li>- One referral code per phone number</li>
          </ul>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border/50 py-8 mt-12">
        <div className="container mx-auto px-4 text-center text-muted-foreground text-sm">
          <Link href="/" className="hover:text-foreground transition-colors">
            Back to Home
          </Link>
          <span className="mx-2">|</span>
          <Link href="/#plans" className="hover:text-foreground transition-colors">
            Browse Plans
          </Link>
        </div>
      </footer>
    </div>
  )
}
