// Promo code configuration
export interface PromoCode {
  code: string
  discountType: "percentage" | "fixed"
  discountValue: number
  minPurchase?: number // Minimum order amount (optional)
  maxUses?: number // Limit total uses (optional - needs database to track)
  expiresAt?: Date // Expiry date (optional)
  startsAt?: Date // Start date (optional) - added start date support
  validApps?: string[] // Restrict to specific apps (optional)
  validPlans?: string[] // Restrict to specific plans (optional)
}

// ============================================
// ADD YOUR PROMO CODES HERE
// ============================================
export const promoCodes: PromoCode[] = [
  // 20% off for new customers (min KSH 50 purchase)
  {
    code: "WELCOME20",
    discountType: "percentage",
    discountValue: 20,
    minPurchase: 50,
  },

  // Fixed KSH 10 off (min KSH 50 purchase)
  {
    code: "FIRST10",
    discountType: "fixed",
    discountValue: 10,
    minPurchase: 50,
  },

  // KSH 50 off monthly plans only
  {
    code: "MONTHLY50",
    discountType: "fixed",
    discountValue: 50,
    validPlans: ["monthly"],
  },

  // 15% off everything
  {
    code: "SAFARI2025",
    discountType: "percentage",
    discountValue: 15,
  },

  // Free 1-day trial (100% off daily plan)
  {
    code: "FREETRIAL",
    discountType: "percentage",
    discountValue: 100,
    validPlans: ["daily"],
  },

  // VIP code - 50% off everything
  {
    code: "VIP50",
    discountType: "percentage",
    discountValue: 50,
  },

  // HTTP Custom specific - KSH 30 off
  {
    code: "HTTPCUSTOM30",
    discountType: "fixed",
    discountValue: 30,
    validApps: ["http-custom"],
  },

  // New Year 2025 offer - expires Jan 31
  {
    code: "NEWYEAR2025",
    discountType: "percentage",
    discountValue: 25,
    expiresAt: new Date("2025-01-31T23:59:59"),
  },

  // Flash sale - 30% off for 24 hours (set your own dates)
  {
    code: "FLASH30",
    discountType: "percentage",
    discountValue: 30,
    startsAt: new Date("2025-06-11T00:00:00"),
    expiresAt: new Date("2025-06-12T23:59:59"),
  },

  // Weekend special - only valid on weekends
  {
    code: "WEEKEND25",
    discountType: "percentage",
    discountValue: 25,
    expiresAt: new Date("2025-12-31T23:59:59"),
  },

  // December holiday sale
  {
    code: "DECEMBER40",
    discountType: "percentage",
    discountValue: 40,
    startsAt: new Date("2025-12-01T00:00:00"),
    expiresAt: new Date("2025-12-31T23:59:59"),
  },
]

// ============================================
// HELPER FUNCTIONS
// ============================================

function formatTimeRemaining(expiresAt: Date): string {
  const now = new Date()
  const diff = expiresAt.getTime() - now.getTime()

  if (diff <= 0) return "expired"

  const days = Math.floor(diff / (1000 * 60 * 60 * 24))
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))

  if (days > 0) return `${days} day${days > 1 ? "s" : ""} left`
  if (hours > 0) return `${hours} hour${hours > 1 ? "s" : ""} left`
  return `${minutes} minute${minutes > 1 ? "s" : ""} left`
}

function isWeekend(): boolean {
  const day = new Date().getDay()
  return day === 0 || day === 6 // Sunday = 0, Saturday = 6
}

// ============================================
// PROMO CODE VALIDATION LOGIC
// ============================================
export function validatePromoCode(
  code: string,
  price: number,
  appId?: string,
  planId?: string,
): { valid: boolean; discount: number; message: string; timeRemaining?: string } {
  const upperCode = code.toUpperCase()
  const promo = promoCodes.find((p) => p.code.toUpperCase() === upperCode)

  if (!promo) {
    return { valid: false, discount: 0, message: "Invalid promo code" }
  }

  const now = new Date()

  if (promo.startsAt && now < promo.startsAt) {
    const startDate = promo.startsAt.toLocaleDateString("en-KE", {
      month: "short",
      day: "numeric",
      year: "numeric",
    })
    return {
      valid: false,
      discount: 0,
      message: `This promo code starts on ${startDate}`,
    }
  }

  // Check expiry
  if (promo.expiresAt && now > promo.expiresAt) {
    return { valid: false, discount: 0, message: "This promo code has expired" }
  }

  if (upperCode === "WEEKEND25" && !isWeekend()) {
    return {
      valid: false,
      discount: 0,
      message: "This promo code is only valid on weekends (Saturday & Sunday)",
    }
  }

  // Check minimum purchase
  if (promo.minPurchase && price < promo.minPurchase) {
    return {
      valid: false,
      discount: 0,
      message: `Minimum purchase of KSH ${promo.minPurchase} required`,
    }
  }

  // Check valid apps
  if (promo.validApps && appId && !promo.validApps.includes(appId)) {
    return {
      valid: false,
      discount: 0,
      message: "This promo code is not valid for this app",
    }
  }

  // Check valid plans
  if (promo.validPlans && planId && !promo.validPlans.includes(planId)) {
    return {
      valid: false,
      discount: 0,
      message: "This promo code is not valid for this plan",
    }
  }

  // Calculate discount
  const discount =
    promo.discountType === "percentage" ? Math.round((price * promo.discountValue) / 100) : promo.discountValue

  const discountText = promo.discountType === "percentage" ? `${promo.discountValue}%` : `KSH ${promo.discountValue}`

  let message = `${discountText} discount applied!`
  let timeRemaining: string | undefined

  if (promo.expiresAt) {
    timeRemaining = formatTimeRemaining(promo.expiresAt)
    message += ` (${timeRemaining})`
  }

  return {
    valid: true,
    discount: Math.min(discount, price), // Don't discount more than the price
    message,
    timeRemaining,
  }
}
