-- PURPOSE: Enable RLS to isolate data per merchant.
-- Ensures one merchant cannot access data of another.

-- Enable RLS
alter table users enable row level security;
alter table screening_results enable row level security;
alter table ip_logs enable row level security;

-- USERS table (usually not queried directly but kept safe)
create policy "Only allow current user to view their row"
  on users for select
  using (auth.uid() = id);

-- SCREENING_RESULTS access
create policy "Merchants can view their screening results"
  on screening_results for select
  using (auth.uid() = user_id);

create policy "Merchants can insert their own screening results"
  on screening_results for insert
  with check (auth.uid() = user_id);

-- IP_LOGS access
create policy "Allow reading and writing IP logs for current user"
  on ip_logs for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);
