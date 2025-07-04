-- PURPOSE: Stores standard reason codes for AI decision justification.
-- Merchants can look up reason meanings in their dashboard.

create table if not exists reason_codes (
  code text primary key, -- e.g. 'R001'
  description text not null -- e.g. 'Match found in OFAC sanctions list'
);

-- Optional: seed default reasons
insert into reason_codes (code, description) values
  ('R001', 'Match found in OFAC sanctions list'),
  ('R002', 'PEP match above threshold'),
  ('R003', 'Customer located in high-risk jurisdiction'),
  ('R004', 'IP address flagged via VPN'),
  ('R005', 'Multiple red flags detected'),
  ('R006', 'No match – cleared by all rules')
on conflict do nothing;
