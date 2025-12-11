import Link from "next/link"
import { Shield, Zap, Globe, Lock, Play, Star, MessageSquarePlus, Phone, Mail, Gift } from "lucide-react"
import { FAQSection } from "@/components/faq-section"
import { TestimonialsSection } from "@/components/testimonials-section"
import { HowItWorksSection } from "@/components/how-it-works-section"
import { ReviewSection } from "@/components/review-section"
import { RequestSection } from "@/components/request-section"

const vpnApps = [
  {
    id: "http-custom",
    name: "HTTP Custom",
    description: "Advanced HTTP tunneling with custom headers",
    icon: Shield,
    color: "from-cyan-500 to-blue-600",
  },
  {
    id: "http-injector",
    name: "HTTP Injector",
    description: "Powerful SSH/Proxy with payload injection",
    icon: Zap,
    color: "from-purple-500 to-pink-600",
  },
  {
    id: "dark-tunnel",
    name: "Dark Tunnel",
    description: "Stealth VPN with advanced obfuscation",
    icon: Lock,
    color: "from-emerald-500 to-teal-600",
  },
  {
    id: "ssc-tunnel",
    name: "SSC Tunnel",
    description: "Secure socket connection for stable browsing",
    icon: Globe,
    color: "from-orange-500 to-red-600",
  },
]

export default function HomePage() {
  return (
    <main className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 backdrop-blur-md bg-background/80 border-b border-border/50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="text-xl font-bold text-foreground">
            Kenya<span className="text-cyan-400">VPN</span>
          </Link>
          <div className="hidden md:flex items-center gap-6">
            <Link href="#apps" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Plans
            </Link>
            <Link
              href="#how-it-works"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              How It Works
            </Link>
            <Link href="#faq" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              FAQ
            </Link>
            <Link
              href="#review"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1"
            >
              <Star className="w-3 h-3" />
              Review
            </Link>
            <Link
              href="#request"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1"
            >
              <MessageSquarePlus className="w-3 h-3" />
              Request
            </Link>
            <Link
              href="/referral"
              className="text-sm text-purple-400 hover:text-purple-300 transition-colors flex items-center gap-1"
            >
              <Gift className="w-3 h-3" />
              Refer & Earn
            </Link>
            <Link href="/guides" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Setup Guides
            </Link>
            <a
              href="https://unlimited.chegejohn.org"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1"
            >
              <Play className="w-3 h-3" />
              Streaming
            </a>
          </div>
          <Link
            href="#apps"
            className="px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 text-white text-sm font-semibold rounded-lg hover:opacity-90 transition-opacity"
          >
            Get Started
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 via-transparent to-purple-500/10" />
        <div className="absolute top-20 left-10 w-72 h-72 bg-cyan-500/20 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl" />

        <div className="relative z-10 container mx-auto px-4 py-20">
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-card/50 backdrop-blur-sm border border-border mb-6">
              <Shield className="w-4 h-4 text-cyan-400" />
              <span className="text-sm text-muted-foreground">Trusted by 10,000+ Kenyans</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6 text-balance">
              Premium VPN Configs for{" "}
              <span className="bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">Kenya</span>
            </h1>
            <p className="text-lg text-muted-foreground mb-8 text-pretty">
              Get unlimited internet access with our premium VPN configurations. Fast, secure, and affordable plans
              starting from just KSH 20.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link
                href="#apps"
                className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold rounded-xl hover:opacity-90 transition-opacity"
              >
                Browse Plans
              </Link>
              <Link
                href="#how-it-works"
                className="px-6 py-3 bg-card/50 backdrop-blur-sm border border-border text-foreground font-semibold rounded-xl hover:bg-card/70 transition-colors"
              >
                Learn More
              </Link>
              <a
                href="https://unlimited.chegejohn.org"
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-600 text-white font-semibold rounded-xl hover:opacity-90 transition-opacity flex items-center gap-2"
              >
                <Play className="w-5 h-5" />
                Streaming Site
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 relative">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">Why Choose Us?</h2>
            <p className="text-muted-foreground">Premium features at affordable prices</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { icon: Zap, title: "Lightning Fast", desc: "High-speed servers optimized for Kenya" },
              { icon: Lock, title: "100% Secure", desc: "Military-grade encryption for your data" },
              { icon: Globe, title: "All Networks", desc: "Works on Safaricom, Airtel & Telkom" },
            ].map((feature, i) => (
              <div
                key={i}
                className="p-6 rounded-2xl bg-card/30 backdrop-blur-md border border-border/50 hover:border-cyan-500/50 transition-colors"
              >
                <feature.icon className="w-10 h-10 text-cyan-400 mb-4" />
                <h3 className="text-xl font-semibold text-foreground mb-2">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* VPN Apps Section */}
      <section id="apps" className="py-20 relative">
        <div className="absolute inset-0 bg-gradient-to-t from-cyan-500/5 to-transparent" />
        <div className="relative z-10 container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">Choose Your VPN App</h2>
            <p className="text-muted-foreground">Select your preferred tunneling application</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {vpnApps.map((app) => (
              <Link
                key={app.id}
                href={`/pricing/${app.id}`}
                className="group p-6 rounded-2xl bg-card/30 backdrop-blur-md border border-border/50 hover:border-cyan-500/50 transition-all hover:scale-105"
              >
                <div
                  className={`w-14 h-14 rounded-xl bg-gradient-to-br ${app.color} flex items-center justify-center mb-4`}
                >
                  <app.icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-2">{app.name}</h3>
                <p className="text-muted-foreground text-sm mb-4">{app.description}</p>
                <span className="text-cyan-400 text-sm font-medium group-hover:underline">View Plans →</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <HowItWorksSection />

      {/* Testimonials Section */}
      <TestimonialsSection />

      {/* Payment Methods */}
      <section className="py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl font-bold text-foreground mb-8">Pay Easily with M-Pesa</h2>
          <div className="inline-flex items-center gap-4 px-8 py-4 rounded-2xl bg-card/30 backdrop-blur-md border border-border/50">
            <div className="w-16 h-16 bg-green-500 rounded-xl flex items-center justify-center">
              <span className="text-white font-bold text-xl">M</span>
            </div>
            <div className="text-left">
              <p className="text-foreground font-semibold">M-Pesa STK Push</p>
              <p className="text-muted-foreground text-sm">Instant payment via your phone</p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <FAQSection />

      {/* Review Section */}
      <ReviewSection />

      {/* Request Section */}
      <RequestSection />

      {/* Footer */}
      <footer className="py-12 border-t border-border/50">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <h3 className="text-lg font-bold text-foreground mb-4">
                Kenya<span className="text-cyan-400">VPN</span>
              </h3>
              <p className="text-muted-foreground text-sm">
                Premium VPN configurations for fast, secure, and unlimited internet access in Kenya.
              </p>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-foreground mb-4">Quick Links</h4>
              <ul className="space-y-2">
                <li>
                  <Link href="#apps" className="text-muted-foreground text-sm hover:text-cyan-400">
                    Plans
                  </Link>
                </li>
                <li>
                  <Link href="/guides" className="text-muted-foreground text-sm hover:text-cyan-400">
                    Setup Guides
                  </Link>
                </li>
                <li>
                  <Link href="#faq" className="text-muted-foreground text-sm hover:text-cyan-400">
                    FAQ
                  </Link>
                </li>
                <li>
                  <Link href="#review" className="text-muted-foreground text-sm hover:text-cyan-400">
                    Leave a Review
                  </Link>
                </li>
                <li>
                  <Link href="#request" className="text-muted-foreground text-sm hover:text-cyan-400">
                    Make a Request
                  </Link>
                </li>
                <li>
                  <a
                    href="https://unlimited.chegejohn.org"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground text-sm hover:text-purple-400"
                  >
                    Streaming Site
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-foreground mb-4">Legal</h4>
              <ul className="space-y-2">
                <li>
                  <Link href="/terms" className="text-muted-foreground text-sm hover:text-cyan-400">
                    Terms of Service
                  </Link>
                </li>
                <li>
                  <Link href="/privacy" className="text-muted-foreground text-sm hover:text-cyan-400">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link href="/admin" className="text-muted-foreground text-sm hover:text-cyan-400">
                    Admin Panel
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-foreground mb-4">Customer Support</h4>
              <ul className="space-y-3">
                <li>
                  <a
                    href="tel:+254781287381"
                    className="text-muted-foreground text-sm hover:text-cyan-400 flex items-center gap-2"
                  >
                    <Phone className="w-4 h-4" />
                    +254 781 287 381
                  </a>
                </li>
                <li>
                  <a
                    href="mailto:support@chegejohn.org"
                    className="text-muted-foreground text-sm hover:text-cyan-400 flex items-center gap-2"
                  >
                    <Mail className="w-4 h-4" />
                    support@chegejohn.org
                  </a>
                </li>
                <li>
                  <a
                    href="https://wa.me/254781287381"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground text-sm hover:text-cyan-400"
                  >
                    WhatsApp
                  </a>
                </li>
                <li>
                  <a
                    href="https://t.me/chegeez_1"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground text-sm hover:text-cyan-400"
                  >
                    Telegram
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="pt-8 border-t border-border/50 text-center text-muted-foreground text-sm">
            <p>© 2025 Kenya VPN Configs. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </main>
  )
}
