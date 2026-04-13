-- ============================================================
-- SkyCam REMAINING BACKEND SETUP
-- Covers booking details, reviews, portfolio, and packages
-- (user_details already exists, services table removed as requested)
-- ============================================================

-- ──────────────────────────────────────────────
-- TABLE 1: booking_inquiries
-- ──────────────────────────────────────────────
create table if not exists booking_inquiries (
  id                bigint generated always as identity primary key,
  client_name       text        not null,
  client_email      text        not null,
  client_phone      text        not null,
  event_type        text        not null,
  event_date        date,
  preferred_package text,
  message           text,
  status            text        not null default 'new',  -- new | seen | confirmed | rejected
  created_at        timestamptz not null default now()
);

alter table booking_inquiries enable row level security;

create policy "Public insert booking_inquiries"
  on booking_inquiries for insert with check (true);

create policy "Admin full access booking_inquiries"
  on booking_inquiries for all using (auth.role() = 'authenticated');


-- ──────────────────────────────────────────────
-- TABLE 2: user_reviews
-- ──────────────────────────────────────────────
create table if not exists user_reviews (
  id          bigint generated always as identity primary key,
  name        text        not null,
  event_type  text        not null,
  rating      int         not null check (rating between 1 and 5),
  message     text        not null,
  status      text        not null default 'pending',  -- pending | approved | rejected
  created_at  timestamptz not null default now()
);

alter table user_reviews enable row level security;

create policy "Public insert user_reviews"
  on user_reviews for insert with check (true);

create policy "Public read approved user_reviews"
  on user_reviews for select using (status = 'approved');

create policy "Admin full access user_reviews"
  on user_reviews for all using (auth.role() = 'authenticated');


-- ──────────────────────────────────────────────
-- TABLE 3: portfolio_photos
-- ──────────────────────────────────────────────
create table if not exists portfolio_photos (
  id           bigint generated always as identity primary key,
  url          text        not null,
  category     text        not null default 'wedding',
  title        text        not null,
  description  text        not null default '',
  sort_order   int         not null default 0,
  is_active    boolean     not null default true,
  created_at   timestamptz not null default now()
);

alter table portfolio_photos enable row level security;

create policy "Public read portfolio_photos"
  on portfolio_photos for select using (is_active = true);

create policy "Admin full access portfolio_photos"
  on portfolio_photos for all using (auth.role() = 'authenticated');

-- Seed Portfolio Photos
insert into portfolio_photos (url, category, title, description, sort_order, is_active) values
  ('/Instapage/wedding_ceremony.png',    'wedding',  'Sacred Vows',      'A beautiful moment of togetherness under golden light', 1,  true),
  ('/Instapage/bride_portrait.png',      'wedding',  'Bridal Radiance',  'Capturing the beauty and grace of the bride',           2,  true),
  ('/Instapage/wedding_together.png',    'wedding',  'Together Forever', 'Two souls becoming one in eternal love',                3,  true),
  ('/Instapage/wedding_golden_hour.png', 'wedding',  'Golden Hour',      'Magic hour light painting the perfect scene',           4,  true),
  ('/Instapage/wedding_candid_joy.png',  'wedding',  'Candid Joy',       'Unscripted laughter and pure happiness',                5,  true),
  ('/Instapage/groom_portrait.png',      'wedding',  'The Groom',        'Confidence and elegance in every frame',                6,  true),
  ('/Instapage/couple_hero.png',         'couple',   'Couple Moments',   'Love stories told through candid frames',               7,  true),
  ('/Instapage/child_wonder.png',        'portrait', 'Little Wonder',    'Childhood wonder captured forever',                     8,  true),
  ('/Instapage/maternity_hero.png',      'maternity','Awaiting Miracle', 'Celebrating the journey of new life',                   9,  true),
  ('/Instapage/portrait_hero.png',       'portrait', 'Generations',      'Family bonds preserved for eternity',                   10, true),
  ('/Instapage/baby_hero.png',           'baby',     'First Steps',      'Every milestone deserves a perfect frame',              11, true),
  ('/Instapage/baby_innocence.png',      'baby',     'Innocence',        'The purest emotions, beautifully preserved',            12, true)
on conflict do nothing;


-- ──────────────────────────────────────────────
-- TABLE 4: cms_packages
-- ──────────────────────────────────────────────
create table if not exists cms_packages (
  id                   bigint generated always as identity primary key,
  tier_id              text        not null unique,
  name                 text        not null,
  subtitle             text        not null default '',
  price                text        not null default 'Contact for Quote',
  description          text        not null default '',
  detailed_description text        not null default '',
  ideal_for            text        not null default '',
  features             jsonb       not null default '[]',
  is_popular           boolean     not null default false,
  icon_name            text        not null default 'Camera',
  sort_order           int         not null default 0,
  is_active            boolean     not null default true
);

alter table cms_packages enable row level security;

create policy "Public read cms_packages"
  on cms_packages for select using (is_active = true);

create policy "Admin full access cms_packages"
  on cms_packages for all using (auth.role() = 'authenticated');

-- Seed Packages
insert into cms_packages (tier_id, name, subtitle, price, description, detailed_description, ideal_for, features, is_popular, icon_name, sort_order, is_active) values
(
  'tier-silver', 'SILVER', 'Essential Elegance', 'Contact for Quote',
  'For intimate events & refined simplicity. Perfect for small functions and personal shoots.',
  'The Silver package is designed for clients who value simplicity and clear, beautiful storytelling. It covers the essentials with high professionalism.',
  'Small events, birthdays, personal shoots',
  '["Traditional Photography","Candid Photography","Traditional Videography","Professional Color Correction","Online Gallery Delivery","High-Resolution Edits","100+ Edited Photos","USB Drive Delivery"]',
  false, 'Camera', 1, true
),
(
  'tier-gold', 'GOLD', 'Signature Cinematic', 'Contact for Quote',
  'Our most chosen package. A perfect blend of traditional coverage and modern cinematic storytelling.',
  'The Gold package is our signature offering, striking the perfect balance between comprehensive coverage and artistic flair.',
  'Weddings, engagements, corporate events',
  '["Traditional + Candid Photography","Traditional + Candid Videography","Drone Videography (4K)","Outdoor Photo & Video Shoot","Cinematic Highlight Film","Advanced Color Grading","Cloud + Drive Delivery","300+ Edited Photos","Instagram Reels (3)","Pre-Wedding Consultation"]',
  true, 'Star', 2, true
),
(
  'tier-platinum', 'PLATINUM', 'Elite Aerial Experience', 'Contact for Quote',
  'The ultimate luxury storytelling package with full-day coverage and premium deliverables.',
  'The Platinum package is for those who want it all — advanced equipment, larger teams, and premium deliverables.',
  'Luxury weddings, large-scale events, resorts',
  '["Full Photography Coverage (All Day)","Cinematic Videography (Full Day)","Advanced Drone Photo & Video (4K/8K)","Cinematic Film + Instagram Reels (5)","360° Spinning Video Recorder","Selfie Booth & Instant Photo Booth","Live Telecast with LED Wall","Premium Retouching & Grading","Priority Editing & Fast Delivery","500+ Edited Photos + Raw Files","Custom Wedding Album (40 Pages)","Second Photographer Included"]',
  false, 'Gem', 3, true
)
on conflict (tier_id) do nothing;


-- ──────────────────────────────────────────────
-- STORAGE BUCKET: cms-assets (for photo uploads)
-- ──────────────────────────────────────────────
insert into storage.buckets (id, name, public)
values ('cms-assets', 'cms-assets', true)
on conflict (id) do nothing;

create policy "Public read cms-assets"
  on storage.objects for select using (bucket_id = 'cms-assets');

create policy "Authenticated upload cms-assets"
  on storage.objects for insert with check (bucket_id = 'cms-assets' and auth.role() = 'authenticated');

create policy "Authenticated delete cms-assets"
  on storage.objects for delete using (bucket_id = 'cms-assets' and auth.role() = 'authenticated');
