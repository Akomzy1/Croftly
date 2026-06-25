-- Croftly — Row Level Security (Prompt 2)
-- RLS on EVERY table (CLAUDE.md convention). Ownership:
--   households.user_id = auth.uid()   producers.user_id = auth.uid()
-- Public (anon + authenticated) read covers discovery surfaces: areas,
-- collection points, farm profiles, active products, aggregate forward demand.

-- ============================================================
-- Enable RLS everywhere
-- ============================================================
alter table areas             enable row level security;
alter table collection_points enable row level security;
alter table producers         enable row level security;
alter table products          enable row level security;
alter table households         enable row level security;
alter table intent_profiles    enable row level security;
alter table orders             enable row level security;
alter table order_items        enable row level security;
alter table payouts            enable row level security;
alter table forward_demand     enable row level security;

-- ============================================================
-- Public read (discovery / marketing surfaces)
-- ============================================================
create policy "areas: public read"
  on areas for select using (true);

create policy "collection_points: public read"
  on collection_points for select using (true);

-- Farm profiles are public marketing pages (SSR/crawlable). Read = anyone.
create policy "producers: public read"
  on producers for select using (true);

-- Producer manages their own farm.
create policy "producers: owner write"
  on producers for all
  using (user_id = auth.uid())
  with check (user_id = auth.uid());

-- Public can read ACTIVE products (within availability window, in stock).
create policy "products: public read active"
  on products for select
  using (
    quantity_available > 0
    and (available_from is null or available_from <= current_date)
    and (available_to   is null or available_to   >= current_date)
  );

-- Producer can read + manage all their own products (incl. inactive).
create policy "products: owner all"
  on products for all
  using (
    exists (
      select 1 from producers p
      where p.id = products.producer_id and p.user_id = auth.uid()
    )
  )
  with check (
    exists (
      select 1 from producers p
      where p.id = products.producer_id and p.user_id = auth.uid()
    )
  );

-- Aggregate, non-personal demand signal — readable (shown to farmers).
create policy "forward_demand: public read"
  on forward_demand for select using (true);

-- ============================================================
-- Household-owned data (households see their own)
-- ============================================================
create policy "households: owner all"
  on households for all
  using (user_id = auth.uid())
  with check (user_id = auth.uid());

create policy "intent_profiles: owner all"
  on intent_profiles for all
  using (
    exists (
      select 1 from households h
      where h.id = intent_profiles.household_id and h.user_id = auth.uid()
    )
  )
  with check (
    exists (
      select 1 from households h
      where h.id = intent_profiles.household_id and h.user_id = auth.uid()
    )
  );

-- ============================================================
-- Orders: household owner manages; involved producers can read
-- ============================================================
create policy "orders: household owner all"
  on orders for all
  using (
    exists (
      select 1 from households h
      where h.id = orders.household_id and h.user_id = auth.uid()
    )
  )
  with check (
    exists (
      select 1 from households h
      where h.id = orders.household_id and h.user_id = auth.uid()
    )
  );

-- A producer can read orders that include one of their items.
create policy "orders: involved producer read"
  on orders for select
  using (
    exists (
      select 1
      from order_items oi
      join producers p on p.id = oi.producer_id
      where oi.order_id = orders.id and p.user_id = auth.uid()
    )
  );

-- ============================================================
-- Order items: household owner (via order) + the line's producer
-- ============================================================
create policy "order_items: household owner all"
  on order_items for all
  using (
    exists (
      select 1
      from orders o
      join households h on h.id = o.household_id
      where o.id = order_items.order_id and h.user_id = auth.uid()
    )
  )
  with check (
    exists (
      select 1
      from orders o
      join households h on h.id = o.household_id
      where o.id = order_items.order_id and h.user_id = auth.uid()
    )
  );

create policy "order_items: line producer read"
  on order_items for select
  using (
    exists (
      select 1 from producers p
      where p.id = order_items.producer_id and p.user_id = auth.uid()
    )
  );

-- ============================================================
-- Payouts: the producer sees their own; household sees payouts for its orders
-- ============================================================
create policy "payouts: producer read"
  on payouts for select
  using (
    exists (
      select 1 from producers p
      where p.id = payouts.producer_id and p.user_id = auth.uid()
    )
  );

create policy "payouts: household read own order"
  on payouts for select
  using (
    exists (
      select 1
      from orders o
      join households h on h.id = o.household_id
      where o.id = payouts.order_id and h.user_id = auth.uid()
    )
  );

-- NOTE (prototype): order_items / payouts / orders are written server-side via a
-- privileged (service-role) path at checkout, which bypasses RLS. The policies
-- above govern client reads. // PRODUCTION: tighten write paths + add audited
-- service functions; full RLS hardening + DPIA before launch.
