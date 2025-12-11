"use client"

import type React from "react"

import { useState } from "react"
import { MessageSquarePlus, Send, CheckCircle } from "lucide-react"

const requestTypes = [
  { id: "new-app", label: "New VPN App" },
  { id: "feature", label: "Feature Request" },
  { id: "network", label: "Network Support" },
  { id: "other", label: "Other" },
]

export function RequestSection() {
  const [requestType, setRequestType] = useState("")
  const [name, setName] = useState("")
  const [phone, setPhone] = useState("")
  const [description, setDescription] = useState("")
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!requestType || !name || !description) return

    const typeLabel = requestTypes.find((t) => t.id === requestType)?.label || requestType

    // Create WhatsApp message with request
    const message = encodeURIComponent(
      `📝 NEW REQUEST 📝\n\nType: ${typeLabel}\nName: ${name}\nPhone: ${phone || "Not provided"}\n\nDescription:\n${description}`,
    )
    window.open(`https://wa.me/254781287381?text=${message}`, "_blank")
    setSubmitted(true)
  }

  if (submitted) {
    return (
      <section id="request" className="py-20 relative">
        <div className="container mx-auto px-4">
          <div className="max-w-xl mx-auto text-center p-8 rounded-2xl bg-card/30 backdrop-blur-md border border-border/50">
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-foreground mb-2">Request Submitted!</h3>
            <p className="text-muted-foreground">We&apos;ll review your request and get back to you soon.</p>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section id="request" className="py-20 relative">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-purple-500/5 to-transparent" />
      <div className="relative z-10 container mx-auto px-4">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-card/50 backdrop-blur-sm border border-border mb-6">
            <MessageSquarePlus className="w-4 h-4 text-purple-400" />
            <span className="text-sm text-muted-foreground">We listen to our customers</span>
          </div>
          <h2 className="text-3xl font-bold text-foreground mb-4">Make a Request</h2>
          <p className="text-muted-foreground">Want a new VPN app or feature? Let us know!</p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="max-w-xl mx-auto p-6 rounded-2xl bg-card/30 backdrop-blur-md border border-border/50"
        >
          {/* Request Type */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-foreground mb-3">Request Type</label>
            <div className="grid grid-cols-2 gap-3">
              {requestTypes.map((type) => (
                <button
                  key={type.id}
                  type="button"
                  onClick={() => setRequestType(type.id)}
                  className={`px-4 py-3 rounded-xl border text-sm font-medium transition-all ${
                    requestType === type.id
                      ? "bg-gradient-to-r from-purple-500 to-pink-600 text-white border-transparent"
                      : "bg-background/50 text-foreground border-border hover:border-purple-500/50"
                  }`}
                >
                  {type.label}
                </button>
              ))}
            </div>
          </div>

          {/* Name Input */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-foreground mb-2">Your Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your name"
              className="w-full px-4 py-3 rounded-xl bg-background/50 border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-purple-500/50"
              required
            />
          </div>

          {/* Phone Input (Optional) */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-foreground mb-2">
              Phone Number <span className="text-muted-foreground">(optional)</span>
            </label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="e.g., 0712345678"
              className="w-full px-4 py-3 rounded-xl bg-background/50 border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-purple-500/50"
            />
          </div>

          {/* Description Input */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-foreground mb-2">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe what you'd like us to add or improve..."
              rows={4}
              className="w-full px-4 py-3 rounded-xl bg-background/50 border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-purple-500/50 resize-none"
              required
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={!requestType || !name || !description}
            className="w-full px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-600 text-white font-semibold rounded-xl hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            <Send className="w-5 h-5" />
            Submit Request
          </button>
        </form>
      </div>
    </section>
  )
}
