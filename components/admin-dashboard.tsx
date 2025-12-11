"use client"

import type React from "react"

import { useState, useEffect } from "react"
import {
  Tag,
  Mail,
  Plus,
  Trash2,
  Send,
  Copy,
  Check,
  DollarSign,
  LogOut,
  Users,
  Gift,
  RefreshCw,
  Clock,
  AlertCircle,
  CheckCircle2,
  Search,
  Calendar,
  Smartphone,
  Fingerprint,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { createClient } from "@/lib/supabase/client"

// Initialize Supabase client with your credentials
interface Customer {
  id: string
  email: string | null
  phone: string
  hwid: string
  app_name: string
  plan_name: string
  duration: string
  amount: number
  reference: string
  referral_code_used: string | null
  expires_at: string
  created_at: string
}

interface Referral {
  id: string
  code: string
  owner_phone: string
  owner_email: string | null
  successful_referrals: number
  reward_claimed: boolean
  created_at: string
}

const initialPromoCodes = [
  { code: "WELCOME20", discount: 20, type: "percentage", minPurchase: 50, description: "20% off for new customers" },
  { code: "FIRST10", discount: 10, type: "fixed", minPurchase: 50, description: "KSH 10 off first purchase" },
  { code: "MONTHLY50", discount: 50, type: "fixed", validPlans: ["monthly"], description: "KSH 50 off monthly plans" },
  { code: "SAFARI2025", discount: 15, type: "percentage", description: "15% off - Safari promotion" },
]

export default function AdminDashboard() {
  const [promoCodes, setPromoCodes] = useState(initialPromoCodes)
  const [copiedCode, setCopiedCode] = useState<string | null>(null)
  const [customers, setCustomers] = useState<Customer[]>([])
  const [referrals, setReferrals] = useState<Referral[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState<"all" | "active" | "expired" | "expiring">("all")

  // New promo code form
  const [newCode, setNewCode] = useState("")
  const [newDiscount, setNewDiscount] = useState("")
  const [newType, setNewType] = useState<"percentage" | "fixed">("percentage")
  const [newMinPurchase, setNewMinPurchase] = useState("")
  const [newDescription, setNewDescription] = useState("")

  // Email form
  const [emailList, setEmailList] = useState("")
  const [emailSubject, setEmailSubject] = useState("")
  const [emailBody, setEmailBody] = useState("")
  const [selectedPromoForEmail, setSelectedPromoForEmail] = useState("")
  const [emailSending, setEmailSending] = useState(false)
  const [emailResult, setEmailResult] = useState<{ success: boolean; message: string } | null>(null)

  const supabase = createClient()

  useEffect(() => {
    fetchCustomers()
    fetchReferrals()
  }, [])

  const fetchCustomers = async () => {
    setLoading(true)
    const { data, error } = await supabase.from("customers").select("*").order("created_at", { ascending: false })

    if (error) {
      console.error("Error fetching customers:", error)
    } else {
      setCustomers(data || [])
    }
    setLoading(false)
  }

  const fetchReferrals = async () => {
    const { data, error } = await supabase.from("referrals").select("*").order("created_at", { ascending: false })

    if (error) {
      console.error("Error fetching referrals:", error)
    } else {
      setReferrals(data || [])
    }
  }

  const getExpiryStatus = (expiresAt: string) => {
    const now = new Date()
    const expiry = new Date(expiresAt)
    const diffHours = (expiry.getTime() - now.getTime()) / (1000 * 60 * 60)

    if (diffHours < 0) return "expired"
    if (diffHours < 24) return "expiring"
    return "active"
  }

  const filteredCustomers = customers.filter((customer) => {
    const matchesSearch =
      customer.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.phone.includes(searchTerm) ||
      customer.hwid.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.reference.toLowerCase().includes(searchTerm.toLowerCase())

    const status = getExpiryStatus(customer.expires_at)
    const matchesFilter =
      filterStatus === "all" ||
      (filterStatus === "active" && status === "active") ||
      (filterStatus === "expired" && status === "expired") ||
      (filterStatus === "expiring" && status === "expiring")

    return matchesSearch && matchesFilter
  })

  const stats = {
    total: customers.length,
    active: customers.filter((c) => getExpiryStatus(c.expires_at) === "active").length,
    expiring: customers.filter((c) => getExpiryStatus(c.expires_at) === "expiring").length,
    expired: customers.filter((c) => getExpiryStatus(c.expires_at) === "expired").length,
    totalRevenue: customers.reduce((sum, c) => sum + c.amount, 0),
  }

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code)
    setCopiedCode(code)
    setTimeout(() => setCopiedCode(null), 2000)
  }

  const handleAddPromoCode = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newCode || !newDiscount) return

    const newPromo = {
      code: newCode.toUpperCase(),
      discount: Number.parseInt(newDiscount),
      type: newType,
      minPurchase: newMinPurchase ? Number.parseInt(newMinPurchase) : undefined,
      description: newDescription,
    }

    setPromoCodes([...promoCodes, newPromo])
    setNewCode("")
    setNewDiscount("")
    setNewType("percentage")
    setNewMinPurchase("")
    setNewDescription("")
  }

  const handleDeletePromoCode = (codeToDelete: string) => {
    setPromoCodes(promoCodes.filter((p) => p.code !== codeToDelete))
  }

  const handleSendBulkEmail = async (e: React.FormEvent) => {
    e.preventDefault()
    setEmailSending(true)
    setEmailResult(null)

    try {
      const response = await fetch("/api/email/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          to: emailList,
          subject: emailSubject,
          body: emailBody,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to send emails")
      }

      setEmailResult({
        success: true,
        message: `Successfully sent ${data.sent} email(s)${data.failed > 0 ? `, ${data.failed} failed` : ""}`,
      })

      if (data.sent > 0 && data.failed === 0) {
        setEmailList("")
        setEmailSubject("")
        setEmailBody("")
        setSelectedPromoForEmail("")
      }
    } catch (error: any) {
      setEmailResult({
        success: false,
        message: error.message || "Failed to send emails",
      })
    } finally {
      setEmailSending(false)
    }
  }

  const loadCustomerEmails = (filter: "all" | "active" | "expiring") => {
    let filtered = customers.filter((c) => c.email)
    if (filter === "active") {
      filtered = filtered.filter((c) => getExpiryStatus(c.expires_at) === "active")
    } else if (filter === "expiring") {
      filtered = filtered.filter((c) => getExpiryStatus(c.expires_at) === "expiring")
    }
    setEmailList(filtered.map((c) => c.email).join("\n"))
  }

  const generatePromoEmailTemplate = (promoCode: string) => {
    const promo = promoCodes.find((p) => p.code === promoCode)
    if (!promo) return

    setEmailSubject(
      `Special Offer: ${promo.discount}${promo.type === "percentage" ? "%" : " KSH"} OFF Your VPN Subscription!`,
    )
    setEmailBody(`Hi there!

We have an exclusive offer just for you!

Use promo code: ${promo.code}

Get ${promo.discount}${promo.type === "percentage" ? "%" : " KSH"} OFF your next VPN subscription!

${promo.minPurchase ? `*Minimum purchase: KSH ${promo.minPurchase}` : ""}

Visit our website to claim your discount.

Available VPN Apps:
- HTTP Custom
- HTTP Injector
- Dark Tunnel
- SSC Tunnel

Plans starting from just KSH 20!

Best regards,
ChegeVPN Team

Support: support@chegejohn.org
WhatsApp: +254 781 287 381`)
  }

  const generateExpiryReminderTemplate = () => {
    setEmailSubject("Your VPN Subscription is Expiring Soon!")
    setEmailBody(`Hi there!

Your VPN subscription is about to expire!

Don't lose access to unlimited internet - renew now and stay connected.

Visit our website to renew your subscription.

Available Plans:
- Daily: KSH 20
- 3 Days: KSH 50
- Weekly: KSH 100
- Bi-Weekly: KSH 180
- Monthly: KSH 300

Need help? Contact us:
WhatsApp: +254 781 287 381
Telegram: @chegeez_1

Best regards,
ChegeVPN Team`)
  }

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("en-KE", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Admin Dashboard</h1>
            <p className="text-muted-foreground">Manage customers, promo codes, and email campaigns</p>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => {
                fetchCustomers()
                fetchReferrals()
              }}
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh
            </Button>
            <Button variant="outline" onClick={() => window.location.reload()}>
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <Card className="border-border/50 bg-card/50 backdrop-blur-xl">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Customers</CardTitle>
              <Users className="w-4 h-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.total}</div>
            </CardContent>
          </Card>
          <Card className="border-border/50 bg-card/50 backdrop-blur-xl">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Active</CardTitle>
              <CheckCircle2 className="w-4 h-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-500">{stats.active}</div>
            </CardContent>
          </Card>
          <Card className="border-border/50 bg-card/50 backdrop-blur-xl">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Expiring Soon</CardTitle>
              <Clock className="w-4 h-4 text-yellow-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-500">{stats.expiring}</div>
            </CardContent>
          </Card>
          <Card className="border-border/50 bg-card/50 backdrop-blur-xl">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Expired</CardTitle>
              <AlertCircle className="w-4 h-4 text-red-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-500">{stats.expired}</div>
            </CardContent>
          </Card>
          <Card className="border-border/50 bg-card/50 backdrop-blur-xl">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
              <DollarSign className="w-4 h-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">KSH {stats.totalRevenue.toLocaleString()}</div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="customers" className="space-y-4">
          <TabsList className="bg-card/50 backdrop-blur-xl">
            <TabsTrigger value="customers">
              <Users className="w-4 h-4 mr-2" />
              Customers
            </TabsTrigger>
            <TabsTrigger value="referrals">
              <Gift className="w-4 h-4 mr-2" />
              Referrals
            </TabsTrigger>
            <TabsTrigger value="promo-codes">
              <Tag className="w-4 h-4 mr-2" />
              Promo Codes
            </TabsTrigger>
            <TabsTrigger value="email-campaign">
              <Mail className="w-4 h-4 mr-2" />
              Bulk Email
            </TabsTrigger>
          </TabsList>

          {/* Customers Tab */}
          <TabsContent value="customers" className="space-y-4">
            <Card className="border-border/50 bg-card/50 backdrop-blur-xl">
              <CardHeader>
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <CardTitle>Customer List</CardTitle>
                    <CardDescription>View all customers with their purchase details and expiry dates</CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        placeholder="Search by email, phone, HWID..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-9 bg-background/50 w-64"
                      />
                    </div>
                    <Select value={filterStatus} onValueChange={(v: any) => setFilterStatus(v)}>
                      <SelectTrigger className="w-36 bg-background/50">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All</SelectItem>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="expiring">Expiring</SelectItem>
                        <SelectItem value="expired">Expired</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="text-center py-8 text-muted-foreground">Loading customers...</div>
                ) : filteredCustomers.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">No customers found</div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-border/50">
                          <th className="text-left py-3 px-2 text-sm font-medium text-muted-foreground">Email</th>
                          <th className="text-left py-3 px-2 text-sm font-medium text-muted-foreground">Phone</th>
                          <th className="text-left py-3 px-2 text-sm font-medium text-muted-foreground">HWID</th>
                          <th className="text-left py-3 px-2 text-sm font-medium text-muted-foreground">Plan</th>
                          <th className="text-left py-3 px-2 text-sm font-medium text-muted-foreground">Amount</th>
                          <th className="text-left py-3 px-2 text-sm font-medium text-muted-foreground">Expires</th>
                          <th className="text-left py-3 px-2 text-sm font-medium text-muted-foreground">Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredCustomers.map((customer) => {
                          const status = getExpiryStatus(customer.expires_at)
                          return (
                            <tr key={customer.id} className="border-b border-border/30 hover:bg-background/30">
                              <td className="py-3 px-2">
                                <div className="flex items-center gap-2">
                                  <Mail className="w-4 h-4 text-muted-foreground" />
                                  <span className="text-sm">{customer.email || "N/A"}</span>
                                </div>
                              </td>
                              <td className="py-3 px-2">
                                <div className="flex items-center gap-2">
                                  <Smartphone className="w-4 h-4 text-muted-foreground" />
                                  <span className="text-sm font-mono">{customer.phone}</span>
                                </div>
                              </td>
                              <td className="py-3 px-2">
                                <div className="flex items-center gap-2">
                                  <Fingerprint className="w-4 h-4 text-muted-foreground" />
                                  <span className="text-sm font-mono truncate max-w-24" title={customer.hwid}>
                                    {customer.hwid.slice(0, 12)}...
                                  </span>
                                  <button
                                    onClick={() => {
                                      navigator.clipboard.writeText(customer.hwid)
                                      setCopiedCode(customer.hwid)
                                      setTimeout(() => setCopiedCode(null), 2000)
                                    }}
                                    className="text-muted-foreground hover:text-foreground"
                                  >
                                    {copiedCode === customer.hwid ? (
                                      <Check className="w-3 h-3 text-green-500" />
                                    ) : (
                                      <Copy className="w-3 h-3" />
                                    )}
                                  </button>
                                </div>
                              </td>
                              <td className="py-3 px-2">
                                <div className="text-sm">
                                  <span className="font-medium">{customer.app_name}</span>
                                  <br />
                                  <span className="text-muted-foreground text-xs">
                                    {customer.plan_name} ({customer.duration})
                                  </span>
                                </div>
                              </td>
                              <td className="py-3 px-2">
                                <span className="text-sm font-semibold text-green-400">KSH {customer.amount}</span>
                              </td>
                              <td className="py-3 px-2">
                                <div className="flex items-center gap-2">
                                  <Calendar className="w-4 h-4 text-muted-foreground" />
                                  <span className="text-sm">{formatDate(customer.expires_at)}</span>
                                </div>
                              </td>
                              <td className="py-3 px-2">
                                <Badge
                                  variant={
                                    status === "active"
                                      ? "default"
                                      : status === "expiring"
                                        ? "secondary"
                                        : "destructive"
                                  }
                                  className={
                                    status === "active"
                                      ? "bg-green-500/20 text-green-400 border-green-500/50"
                                      : status === "expiring"
                                        ? "bg-yellow-500/20 text-yellow-400 border-yellow-500/50"
                                        : "bg-red-500/20 text-red-400 border-red-500/50"
                                  }
                                >
                                  {status === "active" ? "Active" : status === "expiring" ? "Expiring" : "Expired"}
                                </Badge>
                              </td>
                            </tr>
                          )
                        })}
                      </tbody>
                    </table>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Referrals Tab */}
          <TabsContent value="referrals" className="space-y-4">
            <Card className="border-border/50 bg-card/50 backdrop-blur-xl">
              <CardHeader>
                <CardTitle>Referral Codes</CardTitle>
                <CardDescription>View all referral codes and their success count</CardDescription>
              </CardHeader>
              <CardContent>
                {referrals.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">No referral codes yet</div>
                ) : (
                  <div className="space-y-3">
                    {referrals.map((ref) => (
                      <div
                        key={ref.id}
                        className="flex items-center justify-between p-4 rounded-lg bg-background/50 border border-border/50"
                      >
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-mono font-bold text-primary">{ref.code}</span>
                            <button onClick={() => handleCopyCode(ref.code)}>
                              {copiedCode === ref.code ? (
                                <Check className="w-4 h-4 text-green-500" />
                              ) : (
                                <Copy className="w-4 h-4 text-muted-foreground" />
                              )}
                            </button>
                          </div>
                          <p className="text-sm text-muted-foreground mt-1">
                            Owner: {ref.owner_phone} {ref.owner_email && `(${ref.owner_email})`}
                          </p>
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-bold">{ref.successful_referrals}/5</div>
                          <p className="text-sm text-muted-foreground">Referrals</p>
                          {ref.successful_referrals >= 5 && !ref.reward_claimed && (
                            <Badge className="mt-1 bg-green-500/20 text-green-400">Reward Available!</Badge>
                          )}
                          {ref.reward_claimed && (
                            <Badge variant="secondary" className="mt-1">
                              Claimed
                            </Badge>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Promo Codes Tab */}
          <TabsContent value="promo-codes" className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="border-border/50 bg-card/50 backdrop-blur-xl">
                <CardHeader>
                  <CardTitle>Current Promo Codes</CardTitle>
                  <CardDescription>Click on a code to copy it</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3 max-h-[400px] overflow-y-auto">
                  {promoCodes.map((promo) => (
                    <div
                      key={promo.code}
                      className="flex items-center justify-between p-3 rounded-lg bg-background/50 border border-border/50"
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleCopyCode(promo.code)}
                            className="font-mono font-bold text-primary hover:text-primary/80 flex items-center gap-1"
                          >
                            {promo.code}
                            {copiedCode === promo.code ? (
                              <Check className="w-3 h-3 text-green-500" />
                            ) : (
                              <Copy className="w-3 h-3 opacity-50" />
                            )}
                          </button>
                          <Badge variant={promo.type === "percentage" ? "default" : "secondary"}>
                            {promo.discount}
                            {promo.type === "percentage" ? "%" : " KSH"}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">{promo.description}</p>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDeletePromoCode(promo.code)}
                        className="text-red-500 hover:text-red-600 hover:bg-red-500/10"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card className="border-border/50 bg-card/50 backdrop-blur-xl">
                <CardHeader>
                  <CardTitle>Add New Promo Code</CardTitle>
                  <CardDescription>Create a new discount code</CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleAddPromoCode} className="space-y-4">
                    <div className="space-y-2">
                      <Label>Promo Code</Label>
                      <Input
                        placeholder="e.g., SUMMER30"
                        value={newCode}
                        onChange={(e) => setNewCode(e.target.value.toUpperCase())}
                        className="bg-background/50 font-mono"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Discount Value</Label>
                        <Input
                          type="number"
                          placeholder="e.g., 20"
                          value={newDiscount}
                          onChange={(e) => setNewDiscount(e.target.value)}
                          className="bg-background/50"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Type</Label>
                        <Select value={newType} onValueChange={(v: "percentage" | "fixed") => setNewType(v)}>
                          <SelectTrigger className="bg-background/50">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="percentage">Percentage (%)</SelectItem>
                            <SelectItem value="fixed">Fixed (KSH)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>Min Purchase (optional)</Label>
                      <Input
                        type="number"
                        placeholder="e.g., 100"
                        value={newMinPurchase}
                        onChange={(e) => setNewMinPurchase(e.target.value)}
                        className="bg-background/50"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Description</Label>
                      <Input
                        placeholder="e.g., Summer sale discount"
                        value={newDescription}
                        onChange={(e) => setNewDescription(e.target.value)}
                        className="bg-background/50"
                      />
                    </div>
                    <Button type="submit" className="w-full">
                      <Plus className="w-4 h-4 mr-2" />
                      Add Promo Code
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Bulk Email Tab */}
          <TabsContent value="email-campaign" className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="border-border/50 bg-card/50 backdrop-blur-xl">
                <CardHeader>
                  <CardTitle>Compose Bulk Email</CardTitle>
                  <CardDescription>Send promotional emails to your customers</CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSendBulkEmail} className="space-y-4">
                    {emailResult && (
                      <Alert
                        variant={emailResult.success ? "default" : "destructive"}
                        className={emailResult.success ? "border-green-500 bg-green-500/10" : ""}
                      >
                        {emailResult.success ? (
                          <CheckCircle2 className="h-4 w-4 text-green-500" />
                        ) : (
                          <AlertCircle className="h-4 w-4" />
                        )}
                        <AlertTitle>{emailResult.success ? "Success" : "Error"}</AlertTitle>
                        <AlertDescription>{emailResult.message}</AlertDescription>
                      </Alert>
                    )}

                    <div className="space-y-2">
                      <Label>Load Customer Emails</Label>
                      <div className="flex gap-2">
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => loadCustomerEmails("all")}
                          className="bg-transparent"
                        >
                          All ({customers.filter((c) => c.email).length})
                        </Button>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => loadCustomerEmails("active")}
                          className="bg-transparent"
                        >
                          Active
                        </Button>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => loadCustomerEmails("expiring")}
                          className="bg-transparent"
                        >
                          Expiring
                        </Button>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label>Email Recipients</Label>
                      <Textarea
                        placeholder="Enter email addresses (one per line)"
                        value={emailList}
                        onChange={(e) => setEmailList(e.target.value)}
                        className="bg-background/50 min-h-[100px]"
                      />
                      <p className="text-xs text-muted-foreground">
                        {emailList.split(/[\n,]/).filter((e) => e.trim() && e.includes("@")).length} recipient(s)
                      </p>
                    </div>

                    <div className="space-y-2">
                      <Label>Subject</Label>
                      <Input
                        placeholder="Email subject"
                        value={emailSubject}
                        onChange={(e) => setEmailSubject(e.target.value)}
                        className="bg-background/50"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Message</Label>
                      <Textarea
                        placeholder="Email body"
                        value={emailBody}
                        onChange={(e) => setEmailBody(e.target.value)}
                        className="bg-background/50 min-h-[200px]"
                      />
                    </div>

                    <Button
                      type="submit"
                      className="w-full"
                      disabled={emailSending || !emailList || !emailSubject || !emailBody}
                    >
                      {emailSending ? (
                        <>
                          <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                          Sending...
                        </>
                      ) : (
                        <>
                          <Send className="w-4 h-4 mr-2" />
                          Send Emails
                        </>
                      )}
                    </Button>
                  </form>
                </CardContent>
              </Card>

              <Card className="border-border/50 bg-card/50 backdrop-blur-xl">
                <CardHeader>
                  <CardTitle>Email Templates</CardTitle>
                  <CardDescription>Quick templates for common emails</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>Promo Code Template</Label>
                    <Select
                      value={selectedPromoForEmail}
                      onValueChange={(v) => {
                        setSelectedPromoForEmail(v)
                        generatePromoEmailTemplate(v)
                      }}
                    >
                      <SelectTrigger className="bg-background/50">
                        <SelectValue placeholder="Select a promo code" />
                      </SelectTrigger>
                      <SelectContent>
                        {promoCodes.map((promo) => (
                          <SelectItem key={promo.code} value={promo.code}>
                            {promo.code} - {promo.discount}
                            {promo.type === "percentage" ? "%" : " KSH"} off
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <Button variant="outline" className="w-full bg-transparent" onClick={generateExpiryReminderTemplate}>
                    <Clock className="w-4 h-4 mr-2" />
                    Expiry Reminder Template
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
