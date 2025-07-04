-- 04_create_screening_results.sql
-- Purpose: Create screening_results table to store screening outcomes for merchant customers

CREATE TABLE IF NOT EXISTS screening_results (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),  -- Unique ID for each screening result
  user_id UUID NOT NULL REFERENCES users(id),     -- Merchant user reference
  row INTEGER NOT NULL,                            -- Row number from uploaded CSV
  name TEXT NOT NULL,                             -- Customer's name
  contact_details TEXT,                           -- Customer contact details (email, phone, etc.)
  shipping_address TEXT,                          -- Shipping address of customer
  billing_address TEXT,                           -- Billing address of customer
  ip_address TEXT,                                -- Customer's IP address
  is_vpn BOOLEAN DEFAULT FALSE,                   -- Whether IP is from VPN
  matched_sanction_list BOOLEAN DEFAULT FALSE,   -- Whether any sanctions list matched (true/false)
  high_risk_country BOOLEAN DEFAULT FALSE,       -- Whether IP resolves to high-risk country
  pep_match BOOLEAN DEFAULT FALSE,                -- Whether customer matches a Politically Exposed Person
  match_probability NUMERIC(5,2) DEFAULT 0,       -- AI-calculated confidence of hit, 0-100%
  decision TEXT,                                  -- 'BLOCK' or 'ALLOW'
  reason_code TEXT,                               -- Reason code explaining the decision
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()   -- Record creation timestamp
);

-- Index for faster lookups by user_id
CREATE INDEX IF NOT EXISTS idx_screening_results_user_id ON screening_results(user_id);
