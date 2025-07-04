-- PURPOSE: Logs every IP used in screening to trace fraud patterns or VPN abuse.

create table if not exists ip_logs (
  id uuid primary key default gen_random_uuid(),
  ip_address text not null,
  is_vpn boolean,
  country_code text, -- resolved from IP
  detected_at timestamptz default now(),
  user_id uuid references users(id) on delete cascade
);
