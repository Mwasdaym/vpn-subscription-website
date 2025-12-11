import { notFound } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Shield, Zap, Globe, Lock } from "lucide-react"
import CheckoutForm from "@/components/checkout-form"

const vpnApps: Record<string, { name: string; icon: any; color: string }> = {
  "http-custom": { name: "HTTP Custom", icon: Shield, color: "from-cyan-500 to-blue-600" },
  "http-injector": { name: "HTTP Injector", icon: Zap, color: "from-purple-500 to-pink-600" },
  "dark-tunnel": { name: "Dark Tunnel", icon: Lock, color: "from-emerald-500 to-teal-600" },
  "ssc-tunnel": { name: "SSC Tunnel", icon: Globe, color: "from-orange-500 to-red-600" },
}

const pricingPlans: Record<string, { name: string; duration: string; price: number }> = {
  daily: { name: "Daily", duration: "24 Hours", price: 1 },
  "3-days": { name: "3 Days", duration: "3 Days", price: 50 },
  weekly: { name: "Weekly", duration: "7 Days", price: 100 },
  biweekly: { name: "Bi-Weekly", duration: "14 Days", price: 180 },
  monthly: { name: "Monthly", duration: "30 Days", price: 300 },
}

export default async function CheckoutPage({ params }: { params: Promise<{ appId: string; planId: string }> }) {
  const { appId, planId } = await params
  const app = vpnApps[appId]
  const plan = pricingPlans[planId]

  if (!app || !plan) {
    notFound()
  }

  const Icon = app.icon

  return (
    <main className="min-h-screen bg-background relative">
      {/* Background effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 via-transparent to-purple-500/10" />
      <div className="absolute top-40 left-20 w-72 h-72 bg-cyan-500/10 rounded-full blur-3xl" />

      <div className="relative z-10 container mx-auto px-4 py-12">
        <Link
          href={`/pricing/${appId}`}
          className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Plans
        </Link>

        <div className="max-w-xl mx-auto">
          {/* Order Summary */}
          <div className="p-6 rounded-2xl bg-card/30 backdrop-blur-md border border-border/50 mb-6">
            <h2 className="text-lg font-semibold text-foreground mb-4">Order Summary</h2>
            <div className="flex items-center gap-4 pb-4 border-b border-border/50">
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${app.color} flex items-center justify-center`}>
                <Icon className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <p className="font-medium text-foreground">{app.name}</p>
                <p className="text-sm text-muted-foreground">
                  {plan.name} - {plan.duration}
                </p>
              </div>
              <p className="text-xl font-bold text-foreground">KSH {plan.price}</p>
            </div>
            <div className="flex justify-between items-center pt-4">
              <span className="text-muted-foreground">Total</span>
              <span className="text-2xl font-bold text-cyan-400">KSH {plan.price}</span>
            </div>
          </div>

          {/* Checkout Form */}
          <CheckoutForm
            appId={appId}
            appName={app.name}
            planId={planId}
            planName={plan.name}
            price={plan.price}
            duration={plan.duration}
          />
        </div>
      </div>
    </main>
  )
}
