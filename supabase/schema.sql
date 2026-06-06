-- ============================================================
-- Lumière — Full Database Schema
-- Project: Lumière Beauty Store (Supabase)
-- Run this in: Supabase Dashboard > SQL Editor > New query
-- ============================================================

-- Required for gen_random_uuid()
create extension if not exists "pgcrypto";

-- ============================================================
-- Helper: auto-update updated_at on row change
-- ============================================================
create or replace function set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;


-- ============================================================
-- 1. categories
--    Product groupings: Cleanser, Toner, Serum, Moisturizer,
--    Sunscreen, Acne Treatment, Mask, Makeup, Skincare Set,
--    Hair Care, Fragrance, Body Care, Lip Care, Beauty Tool.
-- ============================================================
create table if not exists categories (
  id          uuid        primary key default gen_random_uuid(),
  name        text        not null,
  slug        text        unique not null,
  description text,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

create trigger trg_categories_updated_at
  before update on categories
  for each row execute function set_updated_at();


-- ============================================================
-- 2. brands
--    Beauty brands stocked by the store (Anua, COSRX, etc.).
-- ============================================================
create table if not exists brands (
  id          uuid        primary key default gen_random_uuid(),
  name        text        not null,
  slug        text        unique not null,
  logo_url    text,
  description text,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

create trigger trg_brands_updated_at
  before update on brands
  for each row execute function set_updated_at();


-- ============================================================
-- 3. products
--    Every SKU in the catalog. Includes pricing, stock, skin
--    metadata for AI recommendations, and editorial flags.
-- ============================================================
create table if not exists products (
  id                  uuid        primary key default gen_random_uuid(),
  name                text        not null,
  slug                text        unique,
  brand_id            uuid        references brands(id) on delete set null,
  category_id         uuid        references categories(id) on delete set null,
  price               numeric     not null check (price >= 0),
  original_price      numeric     check (original_price is null or original_price >= 0),
  stock               integer     not null default 0 check (stock >= 0),
  image_url           text,
  description         text,
  main_benefit        text,
  how_to_use          text,
  ingredients         text,
  skin_types          text[]      not null default '{}',
  skin_concerns       text[]      not null default '{}',
  ai_tags             text[]      not null default '{}',
  is_best_seller      boolean     not null default false,
  is_hot_sale         boolean     not null default false,
  is_new_arrival      boolean     not null default false,
  is_ai_recommendable boolean     not null default true,
  rating              numeric     check (rating is null or (rating >= 0 and rating <= 5)),
  review_count        integer     not null default 0 check (review_count >= 0),
  created_at          timestamptz not null default now(),
  updated_at          timestamptz not null default now()
);

create index if not exists idx_products_brand_id    on products(brand_id);
create index if not exists idx_products_category_id on products(category_id);
create index if not exists idx_products_stock       on products(stock);
create index if not exists idx_products_slug        on products(slug);

create trigger trg_products_updated_at
  before update on products
  for each row execute function set_updated_at();


-- ============================================================
-- 4. customers
--    Registered or guest customers. Phone is the primary
--    identifier for Cambodian e-commerce (not email).
-- ============================================================
create table if not exists customers (
  id                uuid        primary key default gen_random_uuid(),
  name              text        not null,
  phone             text        not null,
  telegram_username text,
  telegram_chat_id  text,
  address           text,
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now()
);

create index if not exists idx_customers_phone on customers(phone);

create trigger trg_customers_updated_at
  before update on customers
  for each row execute function set_updated_at();


-- ============================================================
-- 5. profiles
--    Extended user profiles for logged-in customers. Links to
--    Supabase Auth uid. Stores skin quiz results and preferences.
-- ============================================================
create table if not exists profiles (
  id          uuid        primary key default gen_random_uuid(),
  customer_id uuid        unique references customers(id) on delete cascade,
  auth_uid    uuid        unique,
  display_name text,
  avatar_url  text,
  skin_type   text,
  skin_concerns text[]    not null default '{}',
  preferred_language text  not null default 'en' check (preferred_language in ('en', 'km')),
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

create index if not exists idx_profiles_auth_uid    on profiles(auth_uid);
create index if not exists idx_profiles_customer_id on profiles(customer_id);

create trigger trg_profiles_updated_at
  before update on profiles
  for each row execute function set_updated_at();


-- ============================================================
-- 6. orders
--    Each purchase. Contains customer snapshot (name/phone) so
--    the order is readable even if the customer row is deleted.
-- ============================================================
create table if not exists orders (
  id                uuid        primary key default gen_random_uuid(),
  order_code        text        unique not null,
  customer_id       uuid        references customers(id) on delete set null,
  customer_name     text        not null,
  customer_phone    text        not null,
  customer_telegram text,
  delivery_address  text,
  delivery_option   text        not null default 'Pickup at shop'
                                check (delivery_option in (
                                  'Pickup at shop',
                                  'Delivery in Phnom Penh',
                                  'Delivery to province'
                                )),
  note              text,
  total_amount      numeric     not null default 0 check (total_amount >= 0),
  order_status      text        not null default 'New Order'
                                check (order_status in (
                                  'New Order', 'Waiting Payment', 'Paid',
                                  'Preparing', 'Packing', 'Delivering',
                                  'Completed', 'Cancelled'
                                )),
  payment_status    text        not null default 'Payment Pending'
                                check (payment_status in (
                                  'Payment Pending', 'Payment Submitted',
                                  'Payment Successful', 'Payment Failed',
                                  'Payment Expired', 'Refunded'
                                )),
  delivery_status   text        not null default 'Order Created'
                                check (delivery_status in (
                                  'Order Created', 'Payment Successful',
                                  'Preparing', 'Packing', 'Ready for Delivery',
                                  'Delivering', 'Completed', 'Cancelled'
                                )),
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now()
);

create index if not exists idx_orders_code           on orders(order_code);
create index if not exists idx_orders_customer_phone on orders(customer_phone);
create index if not exists idx_orders_customer_id    on orders(customer_id);
create index if not exists idx_orders_order_status   on orders(order_status);
create index if not exists idx_orders_payment_status on orders(payment_status);
create index if not exists idx_orders_created_at     on orders(created_at desc);

create trigger trg_orders_updated_at
  before update on orders
  for each row execute function set_updated_at();


-- ============================================================
-- 7. order_items
--    Line items for each order. Product name is snapshotted so
--    the receipt is accurate even if the product is renamed.
-- ============================================================
create table if not exists order_items (
  id           uuid        primary key default gen_random_uuid(),
  order_id     uuid        not null references orders(id) on delete cascade,
  product_id   uuid        references products(id) on delete set null,
  product_name text        not null,
  quantity     integer     not null default 1 check (quantity > 0),
  unit_price   numeric     not null check (unit_price >= 0),
  total_price  numeric     not null check (total_price >= 0),
  created_at   timestamptz not null default now()
);

create index if not exists idx_order_items_order_id   on order_items(order_id);
create index if not exists idx_order_items_product_id on order_items(product_id);


-- ============================================================
-- 8. payments
--    Payment records linked to orders. Each order can have
--    multiple payment attempts (retry after rejection).
-- ============================================================
create table if not exists payments (
  id                uuid        primary key default gen_random_uuid(),
  order_id          uuid        not null references orders(id) on delete cascade,
  payment_method    text        check (payment_method in (
                                  'Manual', 'KHQR', 'ABA', 'Bakong',
                                  'Cash on Delivery'
                                )),
  amount            numeric     not null check (amount >= 0),
  payment_status    text        not null default 'Payment Pending'
                                check (payment_status in (
                                  'Payment Pending', 'Payment Submitted',
                                  'Payment Successful', 'Payment Failed',
                                  'Payment Expired', 'Refunded'
                                )),
  transaction_id    text,
  payment_reference text,
  proof_url         text,
  paid_at           timestamptz,
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now()
);

create index if not exists idx_payments_order_id on payments(order_id);

create trigger trg_payments_updated_at
  before update on payments
  for each row execute function set_updated_at();


-- ============================================================
-- 9. deliveries
--    Delivery tracking per order. One delivery per order.
-- ============================================================
create table if not exists deliveries (
  id                      uuid        primary key default gen_random_uuid(),
  order_id                uuid        not null unique references orders(id) on delete cascade,
  delivery_company        text,
  tracking_code           text,
  rider_name              text,
  rider_phone             text,
  delivery_note           text,
  estimated_delivery_date date,
  delivery_status         text        not null default 'Order Created'
                                      check (delivery_status in (
                                        'Order Created', 'Payment Successful',
                                        'Preparing', 'Packing', 'Ready for Delivery',
                                        'Delivering', 'Completed', 'Cancelled'
                                      )),
  created_at              timestamptz not null default now(),
  updated_at              timestamptz not null default now()
);

create index if not exists idx_deliveries_order_id on deliveries(order_id);

create trigger trg_deliveries_updated_at
  before update on deliveries
  for each row execute function set_updated_at();


-- ============================================================
-- 10. wishlist_items
--     Per-customer product wishlist. A customer can only
--     wishlist a product once (unique constraint).
-- ============================================================
create table if not exists wishlist_items (
  id          uuid        primary key default gen_random_uuid(),
  customer_id uuid        not null references customers(id) on delete cascade,
  product_id  uuid        not null references products(id) on delete cascade,
  created_at  timestamptz not null default now(),
  unique (customer_id, product_id)
);

create index if not exists idx_wishlist_customer_id on wishlist_items(customer_id);
create index if not exists idx_wishlist_product_id  on wishlist_items(product_id);


-- ============================================================
-- 11. telegram_logs
--     Audit log of every Telegram message sent by the system
--     (order alerts, payment confirmations, delivery updates).
-- ============================================================
create table if not exists telegram_logs (
  id             uuid        primary key default gen_random_uuid(),
  order_id       uuid        references orders(id) on delete set null,
  recipient_type text        not null check (recipient_type in (
                               'Customer', 'Owner', 'Manager', 'Employee'
                             )),
  chat_id        text,
  message_type   text        not null check (message_type in (
                               'New Order', 'Payment Successful', 'Receipt',
                               'Delivery Update', 'Low Stock Alert',
                               'Daily Report', 'AI Question Summary'
                             )),
  message_text   text,
  send_status    text        not null default 'Pending'
                             check (send_status in ('Pending', 'Sent', 'Failed')),
  error_message  text,
  sent_at        timestamptz,
  created_at     timestamptz not null default now()
);

create index if not exists idx_telegram_logs_order_id    on telegram_logs(order_id);
create index if not exists idx_telegram_logs_send_status on telegram_logs(send_status);
create index if not exists idx_telegram_logs_created_at  on telegram_logs(created_at desc);


-- ============================================================
-- 12. ai_conversations
--     Every question a customer asks the AI advisor. Captures
--     skin context so we can analyze popular concerns.
-- ============================================================
create table if not exists ai_conversations (
  id           uuid        primary key default gen_random_uuid(),
  customer_id  uuid        references customers(id) on delete set null,
  session_id   text,
  question     text        not null,
  answer       text,
  language     text        not null default 'en' check (language in ('en', 'km')),
  skin_type    text,
  skin_concern text,
  budget       text,
  created_at   timestamptz not null default now()
);

create index if not exists idx_ai_conversations_customer_id on ai_conversations(customer_id);
create index if not exists idx_ai_conversations_created_at  on ai_conversations(created_at desc);


-- ============================================================
-- 13. ai_recommendations
--     Product recommendations generated per AI conversation.
--     Tracks whether the recommendation led to an order.
-- ============================================================
create table if not exists ai_recommendations (
  id                     uuid        primary key default gen_random_uuid(),
  conversation_id        uuid        not null references ai_conversations(id) on delete cascade,
  recommended_product_ids uuid[]     not null default '{}',
  reason                 text,
  converted_to_order     boolean     not null default false,
  order_id               uuid        references orders(id) on delete set null,
  created_at             timestamptz not null default now()
);

create index if not exists idx_ai_recs_conversation_id on ai_recommendations(conversation_id);
create index if not exists idx_ai_recs_order_id        on ai_recommendations(order_id);


-- ============================================================
-- Done. 13 tables, all with UUID PKs, timestamps, and FKs.
-- RLS is disabled by default — enable before going live.
-- ============================================================
