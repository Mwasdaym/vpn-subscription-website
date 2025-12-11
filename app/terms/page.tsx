import Link from "next/link"
import { ArrowLeft } from "lucide-react"

export default function TermsPage() {
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
          <h1 className="text-4xl font-bold text-foreground mb-8">Terms of Service</h1>

          <div className="prose prose-invert max-w-none space-y-6">
            <div className="p-6 rounded-2xl bg-card/30 backdrop-blur-md border border-border/50">
              <h2 className="text-xl font-semibold text-foreground mb-4">1. Acceptance of Terms</h2>
              <p className="text-muted-foreground">
                By purchasing and using our VPN configuration files, you agree to be bound by these Terms of Service. If
                you do not agree to these terms, please do not use our services.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-card/30 backdrop-blur-md border border-border/50">
              <h2 className="text-xl font-semibold text-foreground mb-4">2. Service Description</h2>
              <p className="text-muted-foreground">
                We provide VPN configuration files for various tunneling applications. These configs are designed to
                provide secure and private internet access. The service is provided "as is" and we reserve the right to
                modify or discontinue the service at any time.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-card/30 backdrop-blur-md border border-border/50">
              <h2 className="text-xl font-semibold text-foreground mb-4">3. Payment Terms</h2>
              <p className="text-muted-foreground">
                All payments are processed via M-Pesa. Prices are displayed in Kenyan Shillings (KSH). Payment is
                required before config files are delivered. Subscription periods begin from the time of delivery.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-card/30 backdrop-blur-md border border-border/50">
              <h2 className="text-xl font-semibold text-foreground mb-4">4. Refund Policy</h2>
              <p className="text-muted-foreground">
                Due to the digital nature of our products, we do not offer refunds once configuration files have been
                delivered. However, if a config file does not work as expected, we will provide a free replacement.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-card/30 backdrop-blur-md border border-border/50">
              <h2 className="text-xl font-semibold text-foreground mb-4">5. Acceptable Use</h2>
              <p className="text-muted-foreground">
                You agree not to use our VPN service for any illegal activities, including but not limited to: copyright
                infringement, hacking, spreading malware, or any activity that violates Kenyan law. We reserve the right
                to terminate service to users who violate these terms.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-card/30 backdrop-blur-md border border-border/50">
              <h2 className="text-xl font-semibold text-foreground mb-4">6. Limitation of Liability</h2>
              <p className="text-muted-foreground">
                We are not responsible for any damages arising from the use of our service, including but not limited
                to: data loss, connection issues, or any other technical problems. Use of our service is at your own
                risk.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-card/30 backdrop-blur-md border border-border/50">
              <h2 className="text-xl font-semibold text-foreground mb-4">7. Contact Information</h2>
              <p className="text-muted-foreground">
                For any questions regarding these terms, please contact us via WhatsApp at +254781287381 or Telegram
                @chegeez_1.
              </p>
            </div>

            <p className="text-sm text-muted-foreground text-center pt-4">Last updated: January 2025</p>
          </div>
        </div>
      </div>
    </main>
  )
}
