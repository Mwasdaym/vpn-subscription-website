import { Star, Quote } from "lucide-react"

const testimonials = [
  {
    name: "Brian K.",
    location: "Nairobi",
    rating: 5,
    text: "Best VPN service in Kenya! The speeds are incredible and M-Pesa payment is so convenient. I've been using HTTP Custom for 6 months now.",
    app: "HTTP Custom",
  },
  {
    name: "Grace M.",
    location: "Mombasa",
    rating: 5,
    text: "Finally found a reliable VPN that works on Safaricom. Customer support is amazing - they respond within minutes on WhatsApp.",
    app: "HTTP Injector",
  },
  {
    name: "Kevin O.",
    location: "Kisumu",
    rating: 5,
    text: "The weekly plan is perfect for me. Great value for money and the connection never drops. Highly recommend Dark Tunnel!",
    app: "Dark Tunnel",
  },
  {
    name: "Mary W.",
    location: "Nakuru",
    rating: 5,
    text: "I was skeptical at first but this service exceeded my expectations. Fast setup, easy payment, and excellent speeds.",
    app: "SSC Tunnel",
  },
  {
    name: "Peter N.",
    location: "Eldoret",
    rating: 5,
    text: "Been using their monthly plan for streaming. Works flawlessly on Airtel. The configs are always updated and reliable.",
    app: "HTTP Custom",
  },
  {
    name: "Faith A.",
    location: "Thika",
    rating: 5,
    text: "The STK push payment is so smooth. Got my config file on Telegram in less than 2 minutes after paying. Great service!",
    app: "HTTP Injector",
  },
]

export function TestimonialsSection() {
  return (
    <section className="py-20 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/5 via-transparent to-purple-500/5" />
      <div className="relative z-10 container mx-auto px-4">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-card/50 backdrop-blur-sm border border-border mb-4">
            <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
            <span className="text-sm text-muted-foreground">Customer Reviews</span>
          </div>
          <h2 className="text-3xl font-bold text-foreground mb-4">What Our Customers Say</h2>
          <p className="text-muted-foreground">Join thousands of satisfied users across Kenya</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="p-6 rounded-2xl bg-card/30 backdrop-blur-md border border-border/50 hover:border-cyan-500/30 transition-colors"
            >
              <div className="flex items-center gap-1 mb-3">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                ))}
              </div>
              <Quote className="w-8 h-8 text-cyan-400/30 mb-2" />
              <p className="text-muted-foreground mb-4">{testimonial.text}</p>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-foreground">{testimonial.name}</p>
                  <p className="text-sm text-muted-foreground">{testimonial.location}</p>
                </div>
                <span className="text-xs px-2 py-1 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
                  {testimonial.app}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
