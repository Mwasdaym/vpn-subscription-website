"use client"

import type React from "react"

import { useState } from "react"
import { Star, Send, CheckCircle, Loader2 } from "lucide-react"

export function ReviewSection() {
  const [rating, setRating] = useState(0)
  const [hoveredRating, setHoveredRating] = useState(0)
  const [name, setName] = useState("")
  const [review, setReview] = useState("")
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (rating === 0 || !name || !review) return

    setLoading(true)

    const message = `⭐ <b>NEW REVIEW</b> ⭐

👤 <b>Name:</b> ${name}
⭐ <b>Rating:</b> ${"⭐".repeat(rating)} (${rating}/5)

💬 <b>Review:</b>
${review}

📅 <b>Date:</b> ${new Date().toLocaleString("en-KE", { timeZone: "Africa/Nairobi" })}`

    try {
      await fetch("/api/telegram/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message, type: "review" }),
      })
    } catch (error) {
      console.error("Failed to send review:", error)
    }

    setLoading(false)
    setSubmitted(true)
  }

  if (submitted) {
    return (
      <section id="review" className="py-20 relative">
        <div className="container mx-auto px-4">
          <div className="max-w-xl mx-auto text-center p-8 rounded-2xl bg-card/30 backdrop-blur-md border border-border/50">
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-foreground mb-2">Thank You!</h3>
            <p className="text-muted-foreground">Your review has been submitted. We appreciate your feedback!</p>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section id="review" className="py-20 relative">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-cyan-500/5 to-transparent" />
      <div className="relative z-10 container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-foreground mb-4">Leave a Review</h2>
          <p className="text-muted-foreground">Share your experience with our VPN configs</p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="max-w-xl mx-auto p-6 rounded-2xl bg-card/30 backdrop-blur-md border border-border/50"
        >
          {/* Star Rating */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-foreground mb-3">Your Rating</label>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoveredRating(star)}
                  onMouseLeave={() => setHoveredRating(0)}
                  className="transition-transform hover:scale-110"
                  disabled={loading}
                >
                  <Star
                    className={`w-8 h-8 ${
                      star <= (hoveredRating || rating) ? "text-yellow-400 fill-yellow-400" : "text-muted-foreground"
                    }`}
                  />
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
              className="w-full px-4 py-3 rounded-xl bg-background/50 border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
              required
              disabled={loading}
            />
          </div>

          {/* Review Input */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-foreground mb-2">Your Review</label>
            <textarea
              value={review}
              onChange={(e) => setReview(e.target.value)}
              placeholder="Tell us about your experience..."
              rows={4}
              className="w-full px-4 py-3 rounded-xl bg-background/50 border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-cyan-500/50 resize-none"
              required
              disabled={loading}
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={rating === 0 || !name || !review || loading}
            className="w-full px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold rounded-xl hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Submitting...
              </>
            ) : (
              <>
                <Send className="w-5 h-5" />
                Submit Review
              </>
            )}
          </button>
        </form>
      </div>
    </section>
  )
}
