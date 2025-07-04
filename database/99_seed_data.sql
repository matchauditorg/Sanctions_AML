-- 99_seed_data.sql
-- Purpose: Insert initial sample data for users and screening_results for testing/demo

-- Insert sample merchant user
INSERT INTO users (id, email, company_name, created_at)
VALUES
  ('00000000-0000-0000-0000-000000000001', 'test@merchant.com', 'Test Merchant', NOW())
ON CONFLICT (id) DO NOTHING;

-- Insert sample screening results for the above merchant user
INSERT INTO screening_results (
  user_id,
  row,
  name,
  contact_details,
  shipping_address,
  billing_address,
  ip_address,
  is_vpn,
  matched_sanction_list,
  high_risk_country,
  pep_match,
  match_probability,
  decision,
  reason_code,
  created_at
) VALUES
  (
    '00000000-0000-0000-0000-000000000001',
    1,
    'John Doe',
    'john.doe@example.com',
    '123 Main St, City, Country',
    '456 Billing Rd, City, Country',
    '192.168.1.1',
    FALSE,
    TRUE,    -- Matched a sanctions list
    FALSE,
    TRUE,
    95.50,
    'BLOCK',
    'R001',
    NOW()
  ),
  (
    '00000000-0000-0000-0000-000000000001',
    2,
    'Jane Smith',
    'jane.smith@example.com',
    '789 Main St, City, Country',
    '101 Billing Rd, City, Country',
    '10.0.0.1',
    TRUE,
    FALSE,
    TRUE,
    FALSE,
    40.00,
    'ALLOW',
    'R002',
    NOW()
  )
ON CONFLICT DO NOTHING;
