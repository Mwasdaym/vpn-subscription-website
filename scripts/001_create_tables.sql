-- ============================================
-- COMPLETE VPN WEBSITE DATABASE SETUP
-- ============================================

-- 1. DROP existing tables (if any)
DROP TABLE IF EXISTS customers CASCADE;
DROP TABLE IF EXISTS referrals CASCADE;
DROP TABLE IF EXISTS email_logs CASCADE;

-- 2. CREATE customers table
CREATE TABLE customers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT,
  phone TEXT NOT NULL,
  hwid TEXT NOT NULL,
  plan TEXT NOT NULL,
  amount INTEGER NOT NULL,
  status TEXT DEFAULT 'active',
  reference TEXT UNIQUE NOT NULL,
  referral_code_used TEXT,
  expires_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. CREATE referrals table
CREATE TABLE referrals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code TEXT UNIQUE NOT NULL,
  owner_phone TEXT NOT NULL,
  owner_email TEXT,
  successful_referrals INTEGER DEFAULT 0,
  reward_claimed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. CREATE email_logs table (optional)
CREATE TABLE email_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  recipient_email TEXT NOT NULL,
  subject TEXT NOT NULL,
  email_type TEXT NOT NULL,
  sent_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. ENABLE Row Level Security
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE referrals ENABLE ROW LEVEL SECURITY;
ALTER TABLE email_logs ENABLE ROW LEVEL SECURITY;

-- 6. CREATE POLICIES (allow all operations for simplicity)
CREATE POLICY "Allow all on customers" ON customers FOR ALL USING (true);
CREATE POLICY "Allow all on referrals" ON referrals FOR ALL USING (true);
CREATE POLICY "Allow all on email_logs" ON email_logs FOR ALL USING (true);

-- 7. INSERT TEST DATA
INSERT INTO customers (phone, hwid, plan, amount, status, reference, expires_at) VALUES
  ('254754610420', 'test123', 'Daily', 1, 'active', 'TEST-001', NOW() + INTERVAL '24 hours'),
  ('254712345678', 'hwid456', 'Monthly', 10, 'active', 'TEST-002', NOW() + INTERVAL '30 days'),
  ('254798765432', 'hwid789', 'Yearly', 100, 'active', 'TEST-003', NOW() + INTERVAL '365 days');

INSERT INTO referrals (code, owner_phone, owner_email) VALUES
  ('WELCOME10', '254754610420', 'chege123456789012@gmail.com'),
  ('SAVE20', '254712345678', 'user2@example.com');

-- 8. CREATE INDEXES for performance
CREATE INDEX idx_customers_phone ON customers(phone);
CREATE INDEX idx_customers_status ON customers(status);
CREATE INDEX idx_customers_expires_at ON customers(expires_at);
CREATE INDEX idx_referrals_code ON referrals(code);
