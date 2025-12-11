import Link from "next/link"
import { ArrowLeft, Shield, Zap, Lock, Globe, Download, Settings, Play } from "lucide-react"

const guides = [
  {
    id: "http-custom",
    name: "HTTP Custom",
    icon: Shield,
    color: "from-cyan-500 to-blue-600",
    downloadLink: "https://play.google.com/store/apps/details?id=com.paaborot.httpcustom",
    steps: [
      "Download and install HTTP Custom from Play Store",
      "Open the app and go to Settings (gear icon)",
      "Import the config file we send you",
      "Return to main screen and tap START",
      "Wait for connection - enjoy browsing!",
    ],
  },
  {
    id: "http-injector",
    name: "HTTP Injector",
    icon: Zap,
    color: "from-purple-500 to-pink-600",
    downloadLink: "https://play.google.com/store/apps/details?id=com.evozi.injector",
    steps: [
      "Download and install HTTP Injector from Play Store",
      "Open the app and tap the menu (3 lines)",
      "Select 'Import Config' from the menu",
      "Choose the .ehi file we send you",
      "Tap START to connect - you're ready!",
    ],
  },
  {
    id: "dark-tunnel",
    name: "Dark Tunnel",
    icon: Lock,
    color: "from-emerald-500 to-teal-600",
    downloadLink: "https://play.google.com/store/apps/details?id=com.darktunnel.android",
    steps: [
      "Download and install Dark Tunnel from Play Store",
      "Open the app and go to Config section",
      "Import the configuration file we provide",
      "Select your preferred server location",
      "Tap Connect and wait for the tunnel to establish",
    ],
  },
  {
    id: "ssc-tunnel",
    name: "SSC Tunnel",
    icon: Globe,
    color: "from-orange-500 to-red-600",
    downloadLink: "https://play.google.com/store/apps/details?id=com.ssctunnel.android",
    steps: [
      "Download and install SSC Tunnel from Play Store",
      "Open the app and navigate to Settings",
      "Tap on 'Import Configuration'",
      "Select the config file from your downloads",
      "Return to home and tap the Connect button",
    ],
  },
]

export default function GuidesPage() {
  return (
    <main className="min-h-screen bg-background">
      {/* Background effects */}
      <div className="fixed inset-0 bg-gradient-to-br from-cyan-500/5 via-transparent to-purple-500/5 pointer-events-none" />

      <div className="relative z-10 container mx-auto px-4 py-12">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </Link>

        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-foreground mb-4">VPN Setup Guides</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Follow these step-by-step instructions to set up your VPN app. Choose your app below to get started.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {guides.map((guide) => (
            <div key={guide.id} className="p-6 rounded-2xl bg-card/30 backdrop-blur-md border border-border/50">
              <div className="flex items-center gap-4 mb-6">
                <div
                  className={`w-14 h-14 rounded-xl bg-gradient-to-br ${guide.color} flex items-center justify-center`}
                >
                  <guide.icon className="w-7 h-7 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-foreground">{guide.name}</h2>
                  <a
                    href={guide.downloadLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-cyan-400 hover:underline inline-flex items-center gap-1"
                  >
                    <Download className="w-3 h-3" />
                    Download from Play Store
                  </a>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
                  <Settings className="w-4 h-4 text-cyan-400" />
                  Setup Instructions
                </h3>
                <ol className="space-y-3">
                  {guide.steps.map((step, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <span className="w-6 h-6 rounded-full bg-cyan-500/20 text-cyan-400 text-sm flex items-center justify-center flex-shrink-0 mt-0.5">
                        {index + 1}
                      </span>
                      <span className="text-muted-foreground">{step}</span>
                    </li>
                  ))}
                </ol>
              </div>

              <div className="mt-6 pt-6 border-t border-border/50">
                <Link
                  href={`/pricing/${guide.id}`}
                  className={`w-full py-3 rounded-xl bg-gradient-to-r ${guide.color} text-white font-semibold hover:opacity-90 transition-opacity flex items-center justify-center gap-2`}
                >
                  <Play className="w-4 h-4" />
                  Get {guide.name} Config
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* Troubleshooting Section */}
        <div className="mt-12 p-6 rounded-2xl bg-card/30 backdrop-blur-md border border-border/50">
          <h2 className="text-2xl font-bold text-foreground mb-6 text-center">Troubleshooting Tips</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <h3 className="font-semibold text-foreground">Connection Issues</h3>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Make sure mobile data is enabled</li>
                <li>• Try switching between WiFi and mobile data</li>
                <li>• Restart the VPN app and try again</li>
                <li>• Clear the app cache from settings</li>
              </ul>
            </div>
            <div className="space-y-2">
              <h3 className="font-semibold text-foreground">Slow Speeds</h3>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Check your network signal strength</li>
                <li>• Try connecting at different times</li>
                <li>• Close other apps using data</li>
                <li>• Contact us for a server change</li>
              </ul>
            </div>
            <div className="space-y-2">
              <h3 className="font-semibold text-foreground">Config Import Failed</h3>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Ensure file downloaded completely</li>
                <li>• Check file is in correct format (.ehi, .hc, etc.)</li>
                <li>• Grant storage permissions to the app</li>
                <li>• Try re-downloading the config file</li>
              </ul>
            </div>
            <div className="space-y-2">
              <h3 className="font-semibold text-foreground">Need Help?</h3>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• WhatsApp: +254781287381</li>
                <li>• Telegram: @chegeez_1</li>
                <li>• We respond within 5 minutes!</li>
                <li>• Free replacements for non-working configs</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
