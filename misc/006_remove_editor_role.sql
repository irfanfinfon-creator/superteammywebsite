-- Remove Editor Role - Simplify to Admin Only
-- Run this in Supabase SQL Editor

-- 1. Change CHECK constraint to allow only 'admin'
ALTER TABLE admin_users 
DROP CONSTRAINT IF EXISTS admin_users_role_check;

ALTER TABLE admin_users 
ADD CHECK (role = 'admin');

-- 2. Update all RLS policies - change from IN ('admin', 'editor') to = 'admin'

-- Members
DROP POLICY IF EXISTS "Editors can update members" ON members;
CREATE POLICY "Editors can update members" ON members FOR UPDATE USING (
    EXISTS (SELECT 1 FROM admin_users WHERE id = auth.uid() AND role = 'admin')
);

-- Events
DROP POLICY IF EXISTS "Editors can update events" ON events;
CREATE POLICY "Editors can update events" ON events FOR UPDATE USING (
    EXISTS (SELECT 1 FROM admin_users WHERE id = auth.uid() AND role = 'admin')
);

-- Partners
DROP POLICY IF EXISTS "Editors can update partners" ON partners;
CREATE POLICY "Editors can update partners" ON partners FOR UPDATE USING (
    EXISTS (SELECT 1 FROM admin_users WHERE id = auth.uid() AND role = 'admin')
);

-- Testimonials
DROP POLICY IF EXISTS "Editors can update testimonials" ON testimonials;
CREATE POLICY "Editors can update testimonials" ON testimonials FOR UPDATE USING (
    EXISTS (SELECT 1 FROM admin_users WHERE id = auth.uid() AND role = 'admin')
);

-- Announcements
DROP POLICY IF EXISTS "Editors can update announcements" ON announcements;
CREATE POLICY "Editors can update announcements" ON announcements FOR UPDATE USING (
    EXISTS (SELECT 1 FROM admin_users WHERE id = auth.uid() AND role = 'admin')
);

-- Landing Page Content
DROP POLICY IF EXISTS "Editors can update landing_page_content" ON landing_page_content;
CREATE POLICY "Editors can update landing_page_content" ON landing_page_content FOR UPDATE USING (
    EXISTS (SELECT 1 FROM admin_users WHERE id = auth.uid() AND role = 'admin')
);

-- 3. Update trigger - change default role from 'editor' to 'admin'
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.admin_users (id, email, role)
    VALUES (NEW.id, NEW.email, 'admin');
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 4. Optional: Update existing editors to admins (if any exist)
UPDATE admin_users SET role = 'admin' WHERE role = 'editor';
