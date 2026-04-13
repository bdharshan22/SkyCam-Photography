-- ============================================================
-- SkyCam CMS Migration
-- Run this in your Supabase SQL Editor (once).
-- ============================================================


-- ──────────────────────────────────────────────
-- 1. PORTFOLIO PHOTOS
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

-- Enable Row Level Security
alter table portfolio_photos enable row level security;

-- Public can read active photos
create policy "Public read portfolio_photos"
  on portfolio_photos for select
  using (is_active = true);

-- Authenticated (admin) can do everything
create policy "Admin full access portfolio_photos"
  on portfolio_photos for all
  using (auth.role() = 'authenticated');

-- Seed with the original 12 hardcoded photos
insert into portfolio_photos (url, category, title, description, sort_order, is_active) values
  ('/Instapage/wedding_ceremony.png',   'wedding',  'Sacred Vows',      'A beautiful moment of togetherness under golden light', 1,  true),
  ('/Instapage/bride_portrait.png',     'wedding',  'Bridal Radiance',  'Capturing the beauty and grace of the bride',           2,  true),
  ('/Instapage/wedding_together.png',   'wedding',  'Together Forever', 'Two souls becoming one in eternal love',                3,  true),
  ('/Instapage/wedding_golden_hour.png','wedding',  'Golden Hour',      'Magic hour light painting the perfect scene',           4,  true),
  ('/Instapage/wedding_candid_joy.png', 'wedding',  'Candid Joy',       'Unscripted laughter and pure happiness',                5,  true),
  ('/Instapage/groom_portrait.png',     'wedding',  'The Groom',        'Confidence and elegance in every frame',                6,  true),
  ('/Instapage/couple_hero.png',        'couple',   'Couple Moments',   'Love stories told through candid frames',               7,  true),
  ('/Instapage/child_wonder.png',       'portrait', 'Little Wonder',    'Childhood wonder captured forever',                     8,  true),
  ('/Instapage/maternity_hero.png',     'maternity','Awaiting Miracle', 'Celebrating the journey of new life',                   9,  true),
  ('/Instapage/portrait_hero.png',      'portrait', 'Generations',      'Family bonds preserved for eternity',                   10, true),
  ('/Instapage/baby_hero.png',          'baby',     'First Steps',      'Every milestone deserves a perfect frame',              11, true),
  ('/Instapage/baby_innocence.png',     'baby',     'Innocence',        'The purest emotions, beautifully preserved',            12, true)
on conflict do nothing;


-- ──────────────────────────────────────────────
-- 2. PACKAGES
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
  on cms_packages for select
  using (is_active = true);

create policy "Admin full access cms_packages"
  on cms_packages for all
  using (auth.role() = 'authenticated');

-- Seed with the 3 original packages
insert into cms_packages (tier_id, name, subtitle, price, description, detailed_description, ideal_for, features, is_popular, icon_name, sort_order, is_active) values
(
  'tier-silver', 'SILVER', 'Essential Elegance', 'Contact for Quote',
  'For intimate events & refined simplicity. Perfect for small functions and personal shoots.',
  'The Silver package is designed for clients who value simplicity and clear, beautiful storytelling. It covers the essentials with high professionalism, ensuring your intimate moments are preserved forever. Ideal for birthdays, small gatherings, and portrait sessions.',
  'Small events, birthdays, personal shoots',
  '["Traditional Photography","Candid Photography","Traditional Videography","Professional Color Correction","Online Gallery Delivery","High-Resolution Edits","100+ Edited Photos","USB Drive Delivery"]',
  false, 'Camera', 1, true
),
(
  'tier-gold', 'GOLD', 'Signature Cinematic', 'Contact for Quote',
  'Our most chosen package. A perfect blend of traditional coverage and modern cinematic storytelling.',
  'The Gold package is our signature offering, striking the perfect balance between comprehensive coverage and artistic flair. It includes everything needed to tell a complete story of your special day — from drone shots to cinematic highlights.',
  'Weddings, engagements, corporate events',
  '["Traditional + Candid Photography","Traditional + Candid Videography","Drone Videography (4K)","Outdoor Photo & Video Shoot","Cinematic Highlight Film","Advanced Color Grading","Cloud + Drive Delivery","300+ Edited Photos","Instagram Reels (3)","Pre-Wedding Consultation"]',
  true, 'Star', 2, true
),
(
  'tier-platinum', 'PLATINUM', 'Elite Aerial Experience', 'Contact for Quote',
  'The ultimate luxury storytelling package with full-day coverage and premium deliverables.',
  'The Platinum package is for those who want it all. It pushes the boundaries with advanced equipment, larger teams, and premium deliverables like live telecasting and instant photo booths.',
  'Luxury weddings, large-scale events, resorts',
  '["Full Photography Coverage (All Day)","Cinematic Videography (Full Day)","Advanced Drone Photo & Video (4K/8K)","Cinematic Film + Instagram Reels (5)","360° Spinning Video Recorder","Selfie Booth & Instant Photo Booth","Live Telecast with LED Wall","Premium Retouching & Grading","Priority Editing & Fast Delivery","500+ Edited Photos + Raw Files","Custom Wedding Album (40 Pages)","Second Photographer Included"]',
  false, 'Gem', 3, true
)
on conflict (tier_id) do nothing;


-- ──────────────────────────────────────────────
-- 3. STANDALONE SERVICES
-- ──────────────────────────────────────────────
create table if not exists cms_standalone_services (
  id             bigint generated always as identity primary key,
  service_id     text        not null unique,
  title          text        not null,
  description    text        not null default '',
  features       jsonb       not null default '[]',
  starting_price text        not null default '',
  icon_name      text        not null default 'Camera',
  sort_order     int         not null default 0,
  is_active      boolean     not null default true
);

alter table cms_standalone_services enable row level security;

create policy "Public read cms_standalone_services"
  on cms_standalone_services for select
  using (is_active = true);

create policy "Admin full access cms_standalone_services"
  on cms_standalone_services for all
  using (auth.role() = 'authenticated');

-- Seed with the 6 original services
insert into cms_standalone_services (service_id, title, description, features, starting_price, icon_name, sort_order, is_active) values
(
  'drone-videography', 'Drone Videography',
  'Professional aerial coverage using DJI drones. Perfect for venue reveals, landscape shots, and cinematic event footage.',
  '["4K/8K Aerial Video","Aerial Photos (48MP)","HyperLapse & TimeLapse","Venue Reveal Shots","DGCA Certified Pilot"]',
  '₹5,000', 'Video', 1, true
),
(
  'product-photography', 'Product Photography',
  'E-commerce and catalog-ready product shots with professional lighting and styling for brands and businesses.',
  '["White Background","Lifestyle Shots","Flat Lay","Social Media Ready","Retouching Included"]',
  '₹3,000', 'Aperture', 2, true
),
(
  'pre-wedding-shoot', 'Pre-Wedding Shoot',
  'Cinematic pre-wedding films and photo sessions at stunning outdoor locations of your choice.',
  '["Outdoor Location Shoot","Cinematic Film","Drone Coverage","Outfit Change (2-3)","Instagram Reel"]',
  '₹8,000', 'Heart', 3, true
),
(
  'portfolio-modeling', 'Portfolio & Modeling Shoots',
  'Professional portfolio creation for aspiring models, actors, and influencers with studio and outdoor options.',
  '["Studio + Outdoor","Professional Styling Tips","50+ Retouched Photos","Composite Card Ready","Same-Day Preview"]',
  '₹5,000', 'Sparkles', 4, true
),
(
  'live-streaming', 'Live Streaming & LED Wall',
  'Real-time live telecast of your event on LED walls or online platforms for remote guests.',
  '["Multi-Camera Setup","Full HD/4K Streaming","LED Wall Display","YouTube/Facebook Live","Replay Recording"]',
  '₹15,000', 'Video', 5, true
),
(
  'photo-booth', 'Photo Booth & 360° Spinner',
  'Fun interactive photo booths and viral 360° spinning video platforms for events and parties.',
  '["Instant Print","360° Spin Videos","Custom Backdrops","Props Included","Social Media Sharing"]',
  '₹8,000', 'Camera', 6, true
)
on conflict (service_id) do nothing;


-- ──────────────────────────────────────────────
-- 4. STORAGE BUCKET (run separately if needed)
-- ──────────────────────────────────────────────
-- Create a public bucket called "cms-assets" for photo uploads.
-- Do this in: Supabase Dashboard → Storage → New Bucket
--   Name: cms-assets
--   Public: YES (toggle on)
-- Then add this storage policy:
insert into storage.buckets (id, name, public) 
values ('cms-assets', 'cms-assets', true)
on conflict (id) do nothing;

create policy "Public read cms-assets"
  on storage.objects for select
  using (bucket_id = 'cms-assets');

create policy "Authenticated upload cms-assets"
  on storage.objects for insert
  using (bucket_id = 'cms-assets' and auth.role() = 'authenticated');

create policy "Authenticated delete cms-assets"
  on storage.objects for delete
  using (bucket_id = 'cms-assets' and auth.role() = 'authenticated');
