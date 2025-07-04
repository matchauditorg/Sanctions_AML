-- PURPOSE: Stores information about registered merchants using the platform.

create table if not exists users (
  id uuid primary key default gen_random_uuid(), -- unique merchant ID
  email text not null unique,
  company_name text,
  created_at timestamptz default now()
);
