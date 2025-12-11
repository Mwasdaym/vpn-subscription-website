import { notFound } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Shield, Zap, Globe, Lock, Check } from "lucide-react"

const vpnApps: Record<string, { name: string; icon: any; color: string }> = {
  "http-custom": { name: "HTTP Custom", icon: Shield, color: "from-cyan-500 to-blue-600" },
  "http-injector": { name: "HTTP Injector", icon: Zap, color: "from-purple-500 to-pink-600" },
  "dark-tunnel": { name: "Dark Tunnel", icon: Lock, color: "from-emerald-500 to-teal-600" },
  "ssc-tunnel": { name: "SSC Tunnel", icon: Globe, color: "from-orange-500 to-red-600" },
}

const pricingPlans = [
  {
    id: "daily",
    name: "Daily",
    duration: "24 Hours",
    price: 20, // 
    features: ["1 Device", "Unlimited Data", "24/7 Support"],
  },
  {
    id: "3-days",
    name: "3 Days",
    duration: "3 Days",
    price: 50,
    features: ["1 Device", "Unlimited Data", "24/7 Support"],
    popular: false,
  },
  {
    id: "weekly",
    name: "Weekly",
    duration: "7 Days",
    price: 100,
    features: ["2 Devices", "Unlimited Data", "Priority Support"],
    popular: true,
  },
  {
    id: "biweekly",
    name: "Bi-Weekly",
    duration: "14 Days",
    price: 180,
    features: ["2 Devices", "Unlimited Data", "Priority Support"],
  },
  {
    id: "monthly",
    name: "Monthly",
    duration: "30 Days",
    price: 300,
    features: ["3 Devices", "Unlimited Data", "VIP Support", "Free Updates"],
  },
]

export default async function PricingPage({ params }: { params: Promise<{ appId: string }> }) {
  const { appId } = await params
  const app = vpnApps[appId]

  if (!app) {
    notFound()
  }

  const Icon = app.icon

  return (
    <main className="min-h-screen bg-background relative">
      {/* Background effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 via-transparent to-purple-500/10" />
      <div className="absolute top-40 left-20 w-72 h-72 bg-cyan-500/10 rounded-full blur-3xl" />
      <div className="absolute bottom-40 right-20 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />

      <div className="relative z-10 container mx-auto px-4 py-12">
        {/* Header */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Apps
        </Link>

        <div className="text-center mb-12">
          <div
            className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${app.color} flex items-center justify-center mx-auto mb-6`}
          >
            <Icon className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">{app.name} Plans</h1>
          <p className="text-muted-foreground">Choose the perfect plan for your needs</p>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-6 max-w-7xl mx-auto">
          {pricingPlans.map((plan) => (
            <div
              key={plan.id}
              className={`relative p-6 rounded-2xl backdrop-blur-md border transition-all hover:scale-105 ${
                plan.popular
                  ? "bg-gradient-to-b from-cyan-500/20 to-card/50 border-cyan-500/50"
                  : "bg-card/30 border-border/50 hover:border-cyan-500/30"
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-gradient-to-r from-cyan-500 to-blue-600 text-white text-xs font-semibold rounded-full">
                  Popular
                </div>
              )}
              <div className="text-center">
                <h3 className="text-lg font-semibold text-foreground mb-1">{plan.name}</h3>
                <p className="text-muted-foreground text-sm mb-4">{plan.duration}</p>
                <div className="mb-6">
                  <span className="text-4xl font-bold text-foreground">KSH {plan.price}</span>
                </div>
                <ul className="space-y-3 mb-6 text-left">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Check className="w-4 h-4 text-cyan-400 flex-shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>
                <Link
                  href={`/checkout/${appId}/${plan.id}`}
                  className={`block w-full py-3 rounded-xl font-semibold transition-all ${
                    plan.popular
                      ? "bg-gradient-to-r from-cyan-500 to-blue-600 text-white hover:opacity-90"
                      : "bg-card/50 border border-border text-foreground hover:border-cyan-500/50"
                  }`}
                >
                  Subscribe
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  )
}
