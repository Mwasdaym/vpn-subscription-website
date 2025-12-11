import { CreditCard, Download, Smartphone, CheckCircle } from "lucide-react"

const steps = [
  {
    icon: Smartphone,
    title: "1. Choose Your App",
    description: "Select your preferred VPN app from HTTP Custom, HTTP Injector, Dark Tunnel, or SSC Tunnel.",
  },
  {
    icon: CreditCard,
    title: "2. Select a Plan",
    description: "Pick a plan that suits your needs - from daily to monthly subscriptions starting at KSH 20.",
  },
  {
    icon: CheckCircle,
    title: "3. Pay with M-Pesa",
    description: "Enter your phone number and complete payment instantly via M-Pesa STK Push.",
  },
  {
    icon: Download,
    title: "4. Get Your Config",
    description: "Receive your config file via WhatsApp or Telegram within minutes and start browsing!",
  },
]

export function HowItWorksSection() {
  return (
    <section id="how-it-works" className="py-20 relative">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-cyan-500/5 to-transparent" />
      <div className="relative z-10 container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-foreground mb-4">How It Works</h2>
          <p className="text-muted-foreground">Get connected in 4 simple steps</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step, index) => (
            <div key={index} className="relative">
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-12 left-full w-full h-0.5 bg-gradient-to-r from-cyan-500/50 to-transparent -translate-x-1/2" />
              )}
              <div className="p-6 rounded-2xl bg-card/30 backdrop-blur-md border border-border/50 text-center">
                <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-cyan-500/20 to-purple-500/20 flex items-center justify-center mb-4 border border-cyan-500/30">
                  <step.icon className="w-8 h-8 text-cyan-400" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">{step.title}</h3>
                <p className="text-muted-foreground text-sm">{step.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
