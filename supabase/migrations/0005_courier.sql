-- Croftly — live courier integration (Stuart). Money in integer PENCE.
-- RLS on every new table (CLAUDE.md convention).
--
-- Adds the address data a real courier needs (pickup = farm, dropoff = household)
-- and a per-farm courier job ledger. A box can span multiple producers, and a
-- Stuart job is one pickup -> one dropoff, so courier_jobs holds ONE ROW PER FARM
-- LEG (decision: point-to-point per farm; batching deferred per the PRD).

-- ============================================================
-- 1) Household delivery address (dropoff). households RLS is owner-only already,
--    so these PII columns are not publicly readable.
-- ============================================================
alter table households
  add column address_line  text,
  add column city          text,
  add column postcode      text,
  add column lat           double precision,
  add column lng           double precision,
  add column contact_name  text,
  add column contact_phone text;

-- ============================================================
-- 2) Producer pickup address — kept OUT of the public `producers` row
--    (farm profiles are public; the exact pickup point is operationally
--    sensitive). Owner + service-role only; never public-read.
-- ============================================================
create table producer_pickup (
  producer_id   uuid primary key references producers (id) on delete cascade,
  address_line  text not null,
  city          text not null,
  postcode      text not null,
  lat           double precision,
  lng           double precision,
  contact_name  text,
  contact_phone text,
  created_at    timestamptz not null default now()
);

-- ============================================================
-- 3) Courier jobs — one row per farm leg (pickup farm -> household dropoff).
--    Written by the service-role path (checkout job creation + webhook).
-- ============================================================
create table courier_jobs (
  id              uuid primary key default gen_random_uuid(),
  order_id        uuid not null references orders (id) on delete cascade,
  producer_id     uuid not null references producers (id) on delete cascade,
  provider        text not null,
  provider_job_id text,
  tracking_url    text,
  status          text not null default 'pending',
  fee_pence       integer not null default 0 check (fee_pence >= 0),
  created_at      timestamptz not null default now()
);
create index courier_jobs_order_idx on courier_jobs (order_id);
create index courier_jobs_provider_job_idx on courier_jobs (provider_job_id);

-- ============================================================
-- 4) Orders: aggregate courier provider label (delivery_fee_pence already exists
--    and stores the SUMMED per-farm fee).
-- ============================================================
alter table orders add column courier_provider text;

-- ============================================================
-- RLS
-- ============================================================
alter table producer_pickup enable row level security;
alter table courier_jobs    enable row level security;

-- producer_pickup: the owning producer only (NOT public).
create policy "producer_pickup: owner all"
  on producer_pickup for all
  using (
    exists (select 1 from producers p where p.id = producer_pickup.producer_id and p.user_id = auth.uid())
  )
  with check (
    exists (select 1 from producers p where p.id = producer_pickup.producer_id and p.user_id = auth.uid())
  );

-- courier_jobs: household reads jobs for its own orders.
create policy "courier_jobs: household read own order"
  on courier_jobs for select
  using (
    exists (
      select 1 from orders o
      join households h on h.id = o.household_id
      where o.id = courier_jobs.order_id and h.user_id = auth.uid()
    )
  );

-- courier_jobs: the involved producer reads its own legs.
create policy "courier_jobs: producer read"
  on courier_jobs for select
  using (
    exists (select 1 from producers p where p.id = courier_jobs.producer_id and p.user_id = auth.uid())
  );

-- NOTE (prototype): producer_pickup + courier_jobs are written server-side via the
-- service-role path (checkout job creation + the Stuart webhook), which bypasses
-- RLS. The policies above govern client reads. // PRODUCTION: tighten write paths,
-- add audited service functions, and a DPIA for the address PII before launch.
