import Link from "next/link"
import { ArrowLeft } from "lucide-react"

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-12">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </Link>

        <div className="max-w-3xl mx-auto">
          <h1 className="text-4xl font-bold text-foreground mb-8">Privacy Policy</h1>

          <div className="prose prose-invert max-w-none space-y-6">
            <div className="p-6 rounded-2xl bg-card/30 backdrop-blur-md border border-border/50">
              <h2 className="text-xl font-semibold text-foreground mb-4">1. Information We Collect</h2>
              <p className="text-muted-foreground">We collect minimal information necessary to provide our service:</p>
              <ul className="list-disc list-inside text-muted-foreground mt-2 space-y-1">
                <li>Phone number (for M-Pesa payment and delivery)</li>
                <li>Transaction reference numbers</li>
                <li>VPN app and plan selected</li>
              </ul>
            </div>

            <div className="p-6 rounded-2xl bg-card/30 backdrop-blur-md border border-border/50">
              <h2 className="text-xl font-semibold text-foreground mb-4">2. How We Use Your Information</h2>
              <p className="text-muted-foreground">Your information is used solely for:</p>
              <ul className="list-disc list-inside text-muted-foreground mt-2 space-y-1">
                <li>Processing your M-Pesa payment</li>
                <li>Delivering your VPN config file via WhatsApp/Telegram</li>
                <li>Providing customer support</li>
                <li>Sending service-related communications</li>
              </ul>
            </div>

            <div className="p-6 rounded-2xl bg-card/30 backdrop-blur-md border border-border/50">
              <h2 className="text-xl font-semibold text-foreground mb-4">3. No Logging Policy</h2>
              <p className="text-muted-foreground">
                We have a strict no-logging policy regarding your VPN usage. We do not:
              </p>
              <ul className="list-disc list-inside text-muted-foreground mt-2 space-y-1">
                <li>Track your browsing activity</li>
                <li>Log websites you visit</li>
                <li>Monitor your data traffic</li>
                <li>Store your IP address history</li>
              </ul>
            </div>

            <div className="p-6 rounded-2xl bg-card/30 backdrop-blur-md border border-border/50">
              <h2 className="text-xl font-semibold text-foreground mb-4">4. Data Security</h2>
              <p className="text-muted-foreground">
                We implement industry-standard security measures to protect your personal information. All payment
                processing is handled securely through M-Pesa's encrypted systems.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-card/30 backdrop-blur-md border border-border/50">
              <h2 className="text-xl font-semibold text-foreground mb-4">5. Third-Party Services</h2>
              <p className="text-muted-foreground">We use the following third-party services:</p>
              <ul className="list-disc list-inside text-muted-foreground mt-2 space-y-1">
                <li>PayHero (M-Pesa payment processing)</li>
                <li>WhatsApp & Telegram (config file delivery)</li>
              </ul>
              <p className="text-muted-foreground mt-2">
                Each of these services has their own privacy policies governing their use of your data.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-card/30 backdrop-blur-md border border-border/50">
              <h2 className="text-xl font-semibold text-foreground mb-4">6. Data Retention</h2>
              <p className="text-muted-foreground">
                We retain transaction records for a period of 90 days for customer support purposes. After this period,
                records are permanently deleted.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-card/30 backdrop-blur-md border border-border/50">
              <h2 className="text-xl font-semibold text-foreground mb-4">7. Your Rights</h2>
              <p className="text-muted-foreground">You have the right to:</p>
              <ul className="list-disc list-inside text-muted-foreground mt-2 space-y-1">
                <li>Request access to your personal data</li>
                <li>Request deletion of your data</li>
                <li>Opt out of marketing communications</li>
              </ul>
            </div>

            <div className="p-6 rounded-2xl bg-card/30 backdrop-blur-md border border-border/50">
              <h2 className="text-xl font-semibold text-foreground mb-4">8. Contact Us</h2>
              <p className="text-muted-foreground">
                For privacy-related inquiries, contact us via WhatsApp at +254781287381 or Telegram @chegeez_1.
              </p>
            </div>

            <p className="text-sm text-muted-foreground text-center pt-4">Last updated: January 2025</p>
          </div>
        </div>
      </div>
    </main>
  )
}
