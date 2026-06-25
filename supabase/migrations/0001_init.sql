-- Croftly — initial schema (Prompt 2)
-- Conventions (CLAUDE.md): money in integer PENCE everywhere; RLS on every table.
-- Apply via: supabase db push  (or paste into the Supabase SQL editor).

-- ============================================================
-- Enums
-- ============================================================
create type cold_chain_class    as enum ('ambient', 'chilled', 'highly_perishable');
create type cadence             as enum ('weekly', 'fortnightly');
create type adventurousness     as enum ('exact', 'balanced', 'surprise');
create type priority_preference as enum ('best_value', 'freshest_closest', 'support_specific');
create type substitution_rule   as enum ('never', 'within_category', 'anything_within_budget');
create type fulfilment_type     as enum ('collection', 'courier');
create type order_status        as enum (
  'pending', 'confirmed', 'preparing', 'ready', 'out_for_delivery', 'delivered', 'cancelled'
);

-- ============================================================
-- Reference / supply tables
-- ============================================================

-- Serving clusters.
create table areas (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  region      text not null,
  created_at  timestamptz not null default now()
);

create table collection_points (
  id          uuid primary key default gen_random_uuid(),
  area_id     uuid not null references areas (id) on delete cascade,
  name        text not null,
  address     text not null,
  created_at  timestamptz not null default now()
);

-- A farm/producer. user_id links the owning auth user (added for RLS ownership;
-- see DEVIATION note in supabase/README.md). Farm profiles are public (marketing).
create table producers (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid references auth.users (id) on delete set null,
  name        text not null,
  area_id     uuid references areas (id) on delete set null,
  story       text,
  bio         text,
  created_at  timestamptz not null default now()
);

create table products (
  id                       uuid primary key default gen_random_uuid(),
  producer_id              uuid not null references producers (id) on delete cascade,
  name                     text not null,
  category                 text not null,
  cold_chain_class         cold_chain_class not null,
  price_pence              integer not null check (price_pence >= 0),
  -- Lowest the farmer will accept. "Best value" matching may surface a low
  -- offered price but NEVER sells below this floor (deterministic hard-stop).
  price_floor_pence        integer check (price_floor_pence is null or price_floor_pence >= 0),
  unit                     text not null,
  variable_weight_min      numeric,
  variable_weight_max      numeric,
  available_from           date,
  available_to             date,
  is_glut                  boolean not null default false,
  glut_clearing_price_pence integer check (glut_clearing_price_pence is null or glut_clearing_price_pence >= 0),
  quantity_available       integer not null default 0 check (quantity_available >= 0),
  created_at               timestamptz not null default now(),
  constraint price_floor_not_above_price
    check (price_floor_pence is null or price_floor_pence <= price_pence)
);

-- ============================================================
-- Household / demand tables
-- ============================================================

create table households (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references auth.users (id) on delete cascade,
  area_id     uuid references areas (id) on delete set null,
  name        text not null,
  created_at  timestamptz not null default now()
);

create table intent_profiles (
  id                  uuid primary key default gen_random_uuid(),
  household_id        uuid not null references households (id) on delete cascade,
  budget_pence        integer not null check (budget_pence >= 0),
  cadence             cadence not null default 'weekly',
  household_size      integer not null default 1 check (household_size >= 1),
  likes               jsonb not null default '[]'::jsonb,
  dislikes            jsonb not null default '[]'::jsonb,
  -- HARD allergens: explicit, separate field. NEVER inferred/honoured by an LLM;
  -- enforced as a deterministic hard exclusion in /lib/matching (CLAUDE.md rule 3).
  hard_allergens      jsonb not null default '[]'::jsonb,
  adventurousness     adventurousness not null default 'balanced',
  -- Default is 'freshest_closest', NEVER 'best_value' (CLAUDE.md / Prompt 5).
  priority_preference priority_preference not null default 'freshest_closest',
  substitution_rule   substitution_rule not null default 'within_category',
  fulfilment_pref     fulfilment_type not null default 'collection',
  created_at          timestamptz not null default now()
);

-- ============================================================
-- Order / money tables (all amounts in integer pence)
-- ============================================================

create table orders (
  id                   uuid primary key default gen_random_uuid(),
  household_id         uuid not null references households (id) on delete cascade,
  status               order_status not null default 'pending',
  fulfilment_type      fulfilment_type not null,
  collection_point_id  uuid references collection_points (id) on delete set null,
  delivery_fee_pence   integer not null default 0 check (delivery_fee_pence >= 0),
  created_at           timestamptz not null default now()
);

create table order_items (
  id              uuid primary key default gen_random_uuid(),
  order_id        uuid not null references orders (id) on delete cascade,
  product_id      uuid references products (id) on delete set null,
  producer_id     uuid not null references producers (id) on delete cascade,
  qty             integer not null check (qty > 0),
  line_price_pence integer not null check (line_price_pence >= 0),
  commission_rate numeric(4,3) not null,            -- e.g. 0.150 / 0.100 / 0.080
  commission_pence integer not null check (commission_pence >= 0),
  farmer_pence    integer not null check (farmer_pence >= 0),
  is_glut         boolean not null default false,
  is_forward      boolean not null default false,
  created_at      timestamptz not null default now()
);

create table payouts (
  id            uuid primary key default gen_random_uuid(),
  order_id      uuid not null references orders (id) on delete cascade,
  producer_id   uuid not null references producers (id) on delete cascade,
  farmer_pence  integer not null check (farmer_pence >= 0),
  platform_pence integer not null check (platform_pence >= 0),
  courier_pence integer not null default 0 check (courier_pence >= 0),
  created_at    timestamptz not null default now()
);

-- Aggregated future demand for the forward market.
create table forward_demand (
  id              uuid primary key default gen_random_uuid(),
  product_category text not null,
  area_id         uuid not null references areas (id) on delete cascade,
  target_window   text not null,                    -- e.g. "2026-08" / "~6 weeks"
  household_count integer not null default 0 check (household_count >= 0),
  implied_qty     numeric not null default 0 check (implied_qty >= 0),
  created_at      timestamptz not null default now()
);

-- ============================================================
-- Indexes
-- ============================================================
create index on collection_points (area_id);
create index on producers (area_id);
create index on producers (user_id);
create index on products (producer_id);
create index on products (category);
create index on households (user_id);
create index on households (area_id);
create index on intent_profiles (household_id);
create index on orders (household_id);
create index on order_items (order_id);
create index on order_items (producer_id);
create index on payouts (order_id);
create index on payouts (producer_id);
create index on forward_demand (area_id);
