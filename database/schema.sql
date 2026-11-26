-- ============================================================================
-- The Sketchbook Chronicles — database schema (Supabase / PostgreSQL)
-- Run this whole file once in Supabase → SQL Editor → New query → Run.
-- ============================================================================

create extension if not exists "pgcrypto";

-- ---------- Visitor submissions (written by the website) ----------
create table if not exists public.messages (
  id          uuid primary key default gen_random_uuid(),
  first_name  text not null check (char_length(first_name) between 1 and 80),
  last_name   text not null check (char_length(last_name)  between 1 and 80),
  email       text not null check (email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$'),
  subject     text check (char_length(subject) <= 200),
  message     text not null check (char_length(message) between 1 and 5000),
  status      text not null default 'new' check (status in ('new','replied','archived')),
  created_at  timestamptz not null default now()
);

create table if not exists public.orders (
  id            uuid primary key default gen_random_uuid(),
  product_code  text not null,
  product_name  text not null,
  variant       text not null,                 -- 'Framed poster' | 'Print only'
  size          text not null,                 -- 'A5' | 'A4' | 'A3' | 'A2'
  price         numeric(10,2) not null check (price >= 0),   -- price each
  quantity      int not null default 1 check (quantity between 1 and 20),
  total         numeric(10,2),                                -- price x quantity (shipping extra)
  payment_method text not null default 'GCash' check (payment_method in ('GCash','Maya','Bank transfer')),
  customer_name text not null check (char_length(customer_name) between 1 and 120),
  email         text not null check (email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$'),
  phone         text,
  note          text check (char_length(note) <= 2000),
  status        text not null default 'new' check (status in ('new','confirmed','paid','shipped','cancelled')),
  created_at    timestamptz not null default now()
);

-- Already created the orders table before? Run these once instead:
--   alter table public.orders add column if not exists quantity int not null default 1;
--   alter table public.orders add column if not exists total numeric(10,2);
--   alter table public.orders add column if not exists payment_method text not null default 'GCash';

create table if not exists public.subscribers (
  id          uuid primary key default gen_random_uuid(),
  email       text not null unique check (email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$'),
  created_at  timestamptz not null default now()
);

-- ---------- Site content (read by the website, edited by you) ----------
create table if not exists public.gallery_items (
  id          bigint generated always as identity primary key,
  title       text not null,
  category    text not null check (category in ('portrait','ink','graphic','painting')),
  medium      text,
  year        int,
  image_url   text not null,
  published   boolean not null default true,
  created_at  timestamptz not null default now()
);

create table if not exists public.blog_posts (
  slug         text primary key,
  title        text not null,
  tag          text not null default 'Journal',
  excerpt      text,
  body         text not null,                 -- simple HTML (<p>…</p>)
  image_url    text not null,
  published_at date not null default current_date,
  published    boolean not null default true
);

create table if not exists public.products (
  code        text primary key,               -- e.g. F1-10
  name        text not null,
  team        text,
  image_url   text not null,
  framed_a5   numeric(10,2) not null default 1200,
  framed_a4   numeric(10,2) not null,
  framed_a3   numeric(10,2) not null,
  framed_a2   numeric(10,2) not null default 3100,
  print_a5    numeric(10,2) not null default 490,
  print_a4    numeric(10,2) not null,
  print_a3    numeric(10,2) not null,
  print_a2    numeric(10,2) not null default 1200,
  active      boolean not null default true
);

-- ---------- Row Level Security ----------
alter table public.messages      enable row level security;
alter table public.orders        enable row level security;
alter table public.subscribers   enable row level security;
alter table public.gallery_items enable row level security;
alter table public.blog_posts    enable row level security;
alter table public.products      enable row level security;

-- Visitors (anon key) may ONLY insert submissions — they can never read them back.
drop policy if exists "anyone can send a message" on public.messages;
create policy "anyone can send a message" on public.messages    for insert to anon with check (true);
drop policy if exists "anyone can place an order" on public.orders;
create policy "anyone can place an order" on public.orders      for insert to anon with check (true);
drop policy if exists "anyone can subscribe" on public.subscribers;
create policy "anyone can subscribe" on public.subscribers for insert to anon with check (true);

-- Visitors may read published content.
drop policy if exists "read gallery" on public.gallery_items;
create policy "read gallery" on public.gallery_items for select to anon using (published);
drop policy if exists "read posts" on public.blog_posts;
create policy "read posts" on public.blog_posts    for select to anon using (published);
drop policy if exists "read products" on public.products;
create policy "read products" on public.products      for select to anon using (active);

-- Only YOU can read and manage everything: the signed-in user whose email is below.
-- (Anyone could sign up with the public key, so being "signed in" alone is not enough.)
-- If you use a different admin email, change it here and run this file again.
create or replace function public.is_owner() returns boolean
language sql stable set search_path = public as $$
  select coalesce(lower(auth.jwt() ->> 'email') = 'leanmarquez0628@yahoo.com', false)
$$;

drop policy if exists "owner all messages" on public.messages;
create policy "owner all messages" on public.messages      for all to authenticated using (public.is_owner()) with check (public.is_owner());
drop policy if exists "owner all orders" on public.orders;
create policy "owner all orders" on public.orders        for all to authenticated using (public.is_owner()) with check (public.is_owner());
drop policy if exists "owner all subscribers" on public.subscribers;
create policy "owner all subscribers" on public.subscribers   for all to authenticated using (public.is_owner()) with check (public.is_owner());
drop policy if exists "owner all gallery" on public.gallery_items;
create policy "owner all gallery" on public.gallery_items for all to authenticated using (public.is_owner()) with check (public.is_owner());
drop policy if exists "owner all posts" on public.blog_posts;
create policy "owner all posts" on public.blog_posts    for all to authenticated using (public.is_owner()) with check (public.is_owner());
drop policy if exists "owner all products" on public.products;
create policy "owner all products" on public.products      for all to authenticated using (public.is_owner()) with check (public.is_owner());

-- ---------- Starter content (matches js/data.js) ----------
insert into public.gallery_items (title, category, medium, year, image_url) values
 ('Two Faces','portrait','Graphite on paper',null,'assets/gallery/portrait-01.jpg'),
 ('Ink Portrait with Hat','ink','Fineliner & ink',null,'assets/gallery/ink-01.jpg'),
 ('Sketchbook Pair','portrait','Graphite on paper',null,'assets/gallery/portrait-02.jpg'),
 ('Ink Duo','ink','Fineliner & ink',null,'assets/gallery/ink-02.jpg'),
 ('Two Girls','portrait','Graphite on paper',null,'assets/gallery/portrait-03.jpg'),
 ('Street Facade','ink','Fineliner, architectural ink',null,'assets/gallery/ink-03.jpg'),
 ('Pencil Spread','portrait','Graphite on paper',null,'assets/gallery/portrait-04.jpg'),
 ('Narrow Building','ink','Fineliner, architectural ink',null,'assets/gallery/ink-04.jpg'),
 ('Glasses & Stars','portrait','Graphite on paper',null,'assets/gallery/portrait-05.jpg'),
 ('Cross-hatch Close-up','ink','Fineliner & marker',null,'assets/gallery/ink-05.jpg'),
 ('Four Faces','portrait','Graphite on paper',null,'assets/gallery/portrait-06.jpg'),
 ('Dark Helmet','ink','Fineliner & marker',null,'assets/gallery/ink-06.jpg')
on conflict do nothing;

-- Graphic design category (safe to re-run; also upgrades an existing database)
alter table public.gallery_items drop constraint if exists gallery_items_category_check;
alter table public.gallery_items add constraint gallery_items_category_check check (category in ('portrait','ink','graphic','painting'));
insert into public.gallery_items (title, category, medium, year, image_url)
select v.* from (values
 ('Lewis Hamilton · Crown','graphic','Digital graphic design',null::int,'assets/gallery/graphic-01.jpg'),
 ('Max Verstappen · Crown','graphic','Digital graphic design',null::int,'assets/gallery/graphic-02.jpg'),
 ('Lando Norris · Champion','graphic','Digital graphic design',null::int,'assets/gallery/graphic-03.jpg'),
 ('Charles Leclerc · 16','graphic','Digital graphic design',null::int,'assets/gallery/graphic-04.jpg'),
 ('Lando Norris · Number 4','graphic','Digital graphic design',null::int,'assets/gallery/graphic-05.jpg'),
 ('Lewis Hamilton · Number 44','graphic','Digital graphic design',null::int,'assets/gallery/graphic-06.jpg')
) as v(title, category, medium, year, image_url)
where not exists (select 1 from public.gallery_items g where g.image_url = v.image_url);
-- Paintings: none yet. The site shows "Coming soon" until you add rows with category 'painting'.

insert into public.products (code, name, team, image_url, framed_a5, framed_a4, framed_a3, print_a5, print_a4, print_a3) values
 ('F1-10','Lewis Hamilton · Ferrari','Ferrari','assets/shop/f1-10.jpg',1400,1600,2100,520,620,890),
 ('F1-11','Charles Leclerc · Ferrari','Ferrari','assets/shop/f1-11.jpg',1400,1600,2100,520,620,890),
 ('F1-12','Max Verstappen · Red Bull','Red Bull','assets/shop/f1-12.jpg',1400,1600,2100,520,620,890),
 ('F1-13','Lando Norris · McLaren','McLaren','assets/shop/f1-13.jpg',1400,1600,2100,520,620,890),
 ('F1-14','Oscar Piastri · McLaren','McLaren','assets/shop/f1-14.jpg',1400,1600,2100,520,620,890),
 ('F1-15','Kimi Antonelli · Mercedes','Mercedes','assets/shop/f1-15.jpg',1400,1600,2100,520,620,890),
 ('F1-16','George Russell · Mercedes','Mercedes','assets/shop/f1-16.jpg',1400,1600,2100,520,620,890),
 ('F1-17','Fernando Alonso · Aston Martin','Aston Martin','assets/shop/f1-17.jpg',1400,1600,2100,520,620,890)
on conflict (code) do nothing;
-- Blog posts: copy them from js/data.js (blog_posts) when you want them managed in the database.

-- ============================================================================
-- Hardening & extras (safe to re-run)
-- ============================================================================

-- Faster admin lists / content reads
create index if not exists messages_created_idx  on public.messages  (created_at desc);
create index if not exists orders_created_idx    on public.orders    (created_at desc);
create index if not exists orders_status_idx     on public.orders    (status);
create index if not exists gallery_cat_idx       on public.gallery_items (category) where published;

-- Spam guard: max 5 messages / orders per email per hour (the website shows a "please wait" notice)
create or replace function public.limit_submissions() returns trigger
language plpgsql security definer set search_path = public as $$
declare recent int;
begin
  execute format('select count(*) from public.%I where lower(email) = lower($1) and created_at > now() - interval ''1 hour''', tg_table_name)
    into recent using new.email;
  if recent >= 5 then
    raise exception 'rate limit: too many submissions, try again later';
  end if;
  return new;
end $$;

-- runs as owner so it can count rows visitors are not allowed to read; not callable from the website
revoke execute on function public.limit_submissions() from public, anon, authenticated;

drop trigger if exists messages_rate on public.messages;
create trigger messages_rate before insert on public.messages for each row execute function public.limit_submissions();
drop trigger if exists orders_rate on public.orders;
create trigger orders_rate before insert on public.orders for each row execute function public.limit_submissions();

-- Orders: the server always works out the total itself (price x quantity)
create or replace function public.orders_total() returns trigger
language plpgsql as $$
begin
  new.total := new.price * new.quantity;
  return new;
end $$;
drop trigger if exists orders_total_trg on public.orders;
create trigger orders_total_trg before insert or update of price, quantity on public.orders for each row execute function public.orders_total();

-- Image storage for artwork uploads (public read, only you can upload)
insert into storage.buckets (id, name, public) values ('artworks', 'artworks', true) on conflict (id) do nothing;
drop policy if exists "artworks are public" on storage.objects;
create policy "artworks are public" on storage.objects for select to anon, authenticated using (bucket_id = 'artworks');
drop policy if exists "owner uploads artworks" on storage.objects;
create policy "owner uploads artworks" on storage.objects for all to authenticated using (bucket_id = 'artworks' and public.is_owner()) with check (bucket_id = 'artworks' and public.is_owner());

-- Handy overview for the Supabase table editor: orders with their totals
create or replace view public.order_overview with (security_invoker = true) as
  select created_at, status, product_code, variant, size, quantity, total, payment_method, customer_name, email, phone
  from public.orders order by created_at desc;

-- ==========================================================================
-- Round 3: data quality. Safe to re-run.
-- ==========================================================================

-- last-changed timestamps (useful in the admin when you change a status)
alter table public.messages add column if not exists updated_at timestamptz not null default now();
alter table public.orders   add column if not exists updated_at timestamptz not null default now();

create or replace function public.touch_updated_at() returns trigger
language plpgsql as $$
begin
  new.updated_at := now();
  return new;
end $$;

drop trigger if exists messages_touch on public.messages;
create trigger messages_touch before update on public.messages for each row execute function public.touch_updated_at();
drop trigger if exists orders_touch on public.orders;
create trigger orders_touch before update on public.orders for each row execute function public.touch_updated_at();

-- tidy input: lowercase + trim emails before they are stored
create or replace function public.normalize_email() returns trigger
language plpgsql as $$
begin
  new.email := lower(btrim(new.email));
  return new;
end $$;

drop trigger if exists messages_email_norm on public.messages;
create trigger messages_email_norm before insert or update on public.messages for each row execute function public.normalize_email();
drop trigger if exists orders_email_norm on public.orders;
create trigger orders_email_norm before insert or update on public.orders for each row execute function public.normalize_email();
drop trigger if exists subscribers_email_norm on public.subscribers;
create trigger subscribers_email_norm before insert or update on public.subscribers for each row execute function public.normalize_email();

-- one subscription per email
create unique index if not exists subscribers_email_uq on public.subscribers (lower(email));

-- sanity limits (NOT VALID = applies to new rows only, so old rows never block the script)
do $$ begin
  alter table public.messages    add constraint messages_email_fmt check (email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$') not valid;
exception when duplicate_object then null; end $$;
do $$ begin
  alter table public.messages    add constraint messages_len check (char_length(message) <= 5000 and char_length(first_name) <= 120 and char_length(last_name) <= 120) not valid;
exception when duplicate_object then null; end $$;
do $$ begin
  alter table public.orders      add constraint orders_email_fmt check (email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$') not valid;
exception when duplicate_object then null; end $$;
do $$ begin
  alter table public.orders      add constraint orders_qty_range check (quantity between 1 and 20) not valid;
exception when duplicate_object then null; end $$;
do $$ begin
  alter table public.subscribers add constraint subscribers_email_fmt check (email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$') not valid;
exception when duplicate_object then null; end $$;

-- show gallery pieces in the order you choose (lower number first)
alter table public.gallery_items add column if not exists sort_order int not null default 0;
create index if not exists gallery_sort_idx on public.gallery_items (sort_order, id);

-- ==========================================================================
-- Poster prices (PHP) + A5 size. Safe to re-run; also updates rows that already exist.
-- A5: framed 1400 / print 520   A4: framed 1600 / print 620   A3: framed 2100 / print 890
-- ==========================================================================
alter table public.products add column if not exists framed_a5 numeric(10,2) not null default 1400;
alter table public.products add column if not exists print_a5  numeric(10,2) not null default 520;
update public.products set
  framed_a5 = 1400, framed_a4 = 1600, framed_a3 = 2100,
  print_a5  = 520,  print_a4  = 620,  print_a3  = 890
where code like 'F1-%';

-- New poster designs (V2). Safe to re-run.
insert into public.products (code, name, team, image_url, framed_a5, framed_a4, framed_a3, print_a5, print_a4, print_a3) values
 ('F1-18','Lewis Hamilton · Ferrari (V2)','Ferrari','assets/shop/f1-18.jpg',1400,1600,2100,520,620,890),
 ('F1-19','Kimi Antonelli · Mercedes (V2)','Mercedes','assets/shop/f1-19.jpg',1400,1600,2100,520,620,890),
 ('F1-20','Lando Norris · McLaren (V2)','McLaren','assets/shop/f1-20.jpg',1400,1600,2100,520,620,890),
 ('F1-21','Max Verstappen · Red Bull (V2)','Red Bull','assets/shop/f1-21.jpg',1400,1600,2100,520,620,890)
on conflict (code) do nothing;

-- ==========================================================================
-- Poster prices v3 (PHP) + A2 size. Safe to re-run.
-- A5: framed 1200 / print 490   A4: framed 1550 / print 560
-- A3: framed 2350 / print 675   A2: framed 3100 / print 1200
-- ==========================================================================
alter table public.products add column if not exists framed_a2 numeric(10,2) not null default 3100;
alter table public.products add column if not exists print_a2  numeric(10,2) not null default 1200;
update public.products set
  framed_a5 = 1200, framed_a4 = 1550, framed_a3 = 2350, framed_a2 = 3100,
  print_a5  = 490,  print_a4  = 560,  print_a3  = 675,  print_a2  = 1200
where code like 'F1-%';

-- ---------- Order safety: the SERVER decides price, total and status ----------
-- Visitors can only insert. Whatever price/total/status the browser sends is replaced
-- with the real values from the products table, so nobody can order at a fake price
-- or mark their own order "paid". The signed-in owner is exempt (can edit freely).
create or replace function public.orders_guard() returns trigger
language plpgsql security definer set search_path = public as $$
declare base text; fmt text; sz text; p public.products%rowtype; unit numeric;
begin
  if public.is_owner() then return new; end if;
  new.id := gen_random_uuid(); new.created_at := now(); new.status := 'new';
  base := substring(new.product_code from '^(.+)-(?:FR|PR)-A[2-5]$');
  fmt  := substring(new.product_code from '-(FR|PR)-A[2-5]$');
  sz   := lower(substring(new.product_code from '-(A[2-5])$'));
  if base is null then raise exception 'invalid product code'; end if;
  select * into p from public.products where code = base and active;
  if not found then raise exception 'product unavailable'; end if;
  unit := case fmt||sz
    when 'FRa5' then p.framed_a5 when 'FRa4' then p.framed_a4 when 'FRa3' then p.framed_a3 when 'FRa2' then p.framed_a2
    when 'PRa5' then p.print_a5  when 'PRa4' then p.print_a4  when 'PRa3' then p.print_a3  when 'PRa2' then p.print_a2 end;
  if unit is null or unit <= 0 then raise exception 'price unavailable'; end if;
  new.product_name := p.name;
  new.variant := case fmt when 'FR' then 'Framed poster' else 'Print only' end;
  new.size := upper(sz);
  new.price := unit;
  new.quantity := least(greatest(coalesce(new.quantity,1),1),20);
  new.total := unit * new.quantity;
  return new;
end $$;
drop trigger if exists orders_guard on public.orders;
create trigger orders_guard before insert on public.orders for each row execute function public.orders_guard();
revoke execute on function public.orders_guard() from public, anon, authenticated;
revoke all on public.orders, public.messages, public.subscribers from anon;
grant insert on public.orders, public.messages, public.subscribers to anon;
alter table public.orders drop constraint if exists orders_phone_len;
alter table public.orders add constraint orders_phone_len check (phone is null or char_length(phone) <= 40);
