"use client"

import { useState } from "react"
import { ChevronDown, HelpCircle } from "lucide-react"

const faqs = [
  {
    question: "How do I receive my VPN config file?",
    answer:
      "After successful payment, you'll be redirected to a page where you can choose to receive your config file via WhatsApp or Telegram. Simply click your preferred option and we'll send your config file within minutes.",
  },
  {
    question: "Which networks does the VPN work on?",
    answer:
      "Our VPN configs work on all major Kenyan networks including Safaricom, Airtel, and Telkom. We optimize our servers specifically for Kenyan networks to ensure the best possible speeds.",
  },
  {
    question: "How long does the config file last?",
    answer:
      "Your config file will work for the duration you purchased - Daily (24 hours), 3 Days, Weekly (7 days), Bi-Weekly (14 days), or Monthly (30 days). After expiry, you'll need to purchase a new config.",
  },
  {
    question: "Can I use the config on multiple devices?",
    answer:
      "Each config file is meant for single device use. If you need to use VPN on multiple devices, please purchase separate configs for each device.",
  },
  {
    question: "What if the payment fails?",
    answer:
      "If your M-Pesa payment fails, no money will be deducted from your account. You can try again immediately. If you experience persistent issues, contact us on WhatsApp or Telegram.",
  },
  {
    question: "Is my browsing data private?",
    answer:
      "Yes, absolutely. We use military-grade encryption to secure your connection. We don't log your browsing activity or sell your data to third parties.",
  },
  {
    question: "What if the VPN stops working?",
    answer:
      "If your VPN stops working before your subscription expires, contact us immediately on WhatsApp or Telegram. We'll provide you with a replacement config file free of charge.",
  },
  {
    question: "Do you offer refunds?",
    answer:
      "Due to the digital nature of our product, we don't offer refunds once the config file has been delivered. However, we guarantee replacement if the config doesn't work as expected.",
  },
]

export function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  return (
    <section id="faq" className="py-20 relative">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-purple-500/5 to-transparent" />
      <div className="relative z-10 container mx-auto px-4">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-card/50 backdrop-blur-sm border border-border mb-4">
            <HelpCircle className="w-4 h-4 text-cyan-400" />
            <span className="text-sm text-muted-foreground">Got Questions?</span>
          </div>
          <h2 className="text-3xl font-bold text-foreground mb-4">Frequently Asked Questions</h2>
          <p className="text-muted-foreground">Find answers to common questions about our VPN service</p>
        </div>

        <div className="max-w-3xl mx-auto space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="rounded-2xl bg-card/30 backdrop-blur-md border border-border/50 overflow-hidden"
            >
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full px-6 py-4 flex items-center justify-between text-left"
              >
                <span className="font-medium text-foreground">{faq.question}</span>
                <ChevronDown
                  className={`w-5 h-5 text-muted-foreground transition-transform ${
                    openIndex === index ? "rotate-180" : ""
                  }`}
                />
              </button>
              {openIndex === index && (
                <div className="px-6 pb-4">
                  <p className="text-muted-foreground">{faq.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
