-- ============================================================
-- SETUP FIRST ADMIN
-- ============================================================
-- This script helps the first admin gain access to the CMS.
-- 
-- INSTRUCTIONS:
-- 1. Get your Supabase Auth User ID:
--    - Go to Supabase Dashboard → Authentication → Users
--    - Find your user (or create a new account)
--    - Copy the User ID (e.g., "abc-123-def-456")
--
-- 2. Replace the values below:
--    - 'YOUR-AUTH-USER-ID-HERE' → Your User ID from step 1
--    - 'your-email@example.com' → Your email
--
-- 3. Run this SQL in Supabase SQL Editor
--
-- 4. Login to CMS at /login with your Supabase credentials
--    (same email + password you use for Supabase)
-- ============================================================

-- Option A: Insert first admin directly (recommended)
-- ============================================================
INSERT INTO public.admin_users (id, email, role)
VALUES (
  'YOUR-AUTH-USER-ID-HERE',  -- Replace with your Supabase Auth User ID
  'your-email@example.com',   -- Replace with your email
  'admin'
)
ON CONFLICT (id) DO UPDATE SET role = 'admin';


-- Option B: Create invitation token (if you want to invite others later)
-- After becoming admin, run this to create an invitation for others:
-- ============================================================
-- INSERT INTO public.admin_invitations (id, token, invited_by, status, expires_at)
-- SELECT 
--   gen_random_uuid(),
--   'st-firstadmin',
--   id,
--   'pending',
--   NOW() + INTERVAL '30 days'
-- FROM public.admin_users
-- LIMIT 1;


-- Helper: Find your Auth User ID by email
-- Run this if you don't know your User ID:
-- ============================================================
-- SELECT id, email, created_at 
-- FROM auth.users 
-- WHERE email = 'your-email@example.com';
