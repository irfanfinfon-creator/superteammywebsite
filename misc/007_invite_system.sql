-- Admin Invite System - Token-Based Signup
-- Run this in Supabase SQL Editor
-- Date: March 11, 2026

-- Drop existing policies (if any)
DROP POLICY IF EXISTS "Anyone can read invitation by token" ON admin_invitations;
DROP POLICY IF EXISTS "Admins can manage invitations" ON admin_invitations;

-- New Policy: Allow authenticated users to insert and manage their own
CREATE POLICY "Auth users can manage invitations"
ON admin_invitations FOR ALL
TO authenticated
USING (
  EXISTS (SELECT 1 FROM admin_users WHERE id = auth.uid() AND role = 'admin')
)
WITH CHECK (
  EXISTS (SELECT 1 FROM admin_users WHERE id = auth.uid() AND role = 'admin')
);

-- Policy: Allow public read for token validation (no USING clause = public)
CREATE POLICY "Public can read by token"
ON admin_invitations FOR SELECT
TO anon, authenticated
USING (true);
