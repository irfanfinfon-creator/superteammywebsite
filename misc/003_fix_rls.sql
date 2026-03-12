-- Fix RLS infinite recursion on admin_users table
-- Run this in Supabase SQL Editor

-- Option 1: Disable RLS on admin_users (simplest)
ALTER TABLE admin_users DISABLE ROW LEVEL SECURITY;

-- Option 2: If you want to keep RLS, use this instead:
-- DROP POLICY IF EXISTS "Admins can manage admin_users" ON admin_users;
-- CREATE POLICY "Users can read own admin record" ON admin_users FOR SELECT 
-- USING (auth.uid() = id);
