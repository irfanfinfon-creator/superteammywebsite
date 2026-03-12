-- SUPERTEAMMY Database Schema
-- Run this in Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. MEMBERS TABLE
CREATE TABLE members (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    photo_url TEXT,
    role TEXT,
    company TEXT,
    skills TEXT[] DEFAULT '{}',
    twitter_url TEXT,
    hackathon_wins INTEGER DEFAULT 0,
    projects_built INTEGER DEFAULT 0,
    grants_received INTEGER DEFAULT 0,
    dao_contributions INTEGER DEFAULT 0,
    bounties_completed INTEGER DEFAULT 0,
    is_featured BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. EVENTS TABLE
CREATE TABLE events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    description TEXT,
    date TIMESTAMP WITH TIME ZONE,
    location TEXT,
    image_url TEXT,
    luma_url TEXT,
    is_upcoming BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. PARTNERS TABLE
CREATE TABLE partners (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    logo_url TEXT,
    website_url TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. TESTIMONIALS TABLE
CREATE TABLE testimonials (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    role TEXT,
    company TEXT,
    photo_url TEXT,
    content TEXT NOT NULL,
    twitter_url TEXT,
    is_featured BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. ANNOUNCEMENTS TABLE
CREATE TABLE announcements (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    content TEXT,
    image_url TEXT,
    is_published BOOLEAN DEFAULT false,
    published_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. LANDING PAGE CONTENT TABLE
CREATE TABLE landing_page_content (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    section TEXT NOT NULL UNIQUE,
    title TEXT,
    subtitle TEXT,
    content TEXT,
    cta_text TEXT,
    cta_url TEXT,
    image_url TEXT,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 7. ADMIN USERS TABLE (links to Supabase Auth)
CREATE TABLE admin_users (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL,
    role TEXT DEFAULT 'editor' CHECK (role IN ('admin', 'editor')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS (Row Level Security)
ALTER TABLE members ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE partners ENABLE ROW LEVEL SECURITY;
ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;
ALTER TABLE announcements ENABLE ROW LEVEL SECURITY;
ALTER TABLE landing_page_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

-- RLS Policies - Public read access
CREATE POLICY "Public can read members" ON members FOR SELECT USING (true);
CREATE POLICY "Public can read events" ON events FOR SELECT USING (true);
CREATE POLICY "Public can read partners" ON partners FOR SELECT USING (true);
CREATE POLICY "Public can read testimonials" ON testimonials FOR SELECT USING (true);
CREATE POLICY "Public can read announcements" ON announcements FOR SELECT USING (is_published = true);
CREATE POLICY "Public can read landing_page_content" ON landing_page_content FOR SELECT USING (true);

-- RLS Policies - Admin write access (authenticated users with admin_users record)
CREATE POLICY "Admins can manage members" ON members FOR ALL USING (
    EXISTS (SELECT 1 FROM admin_users WHERE id = auth.uid() AND role = 'admin')
);
CREATE POLICY "Admins can manage events" ON events FOR ALL USING (
    EXISTS (SELECT 1 FROM admin_users WHERE id = auth.uid() AND role = 'admin')
);
CREATE POLICY "Admins can manage partners" ON partners FOR ALL USING (
    EXISTS (SELECT 1 FROM admin_users WHERE id = auth.uid() AND role = 'admin')
);
CREATE POLICY "Admins can manage testimonials" ON testimonials FOR ALL USING (
    EXISTS (SELECT 1 FROM admin_users WHERE id = auth.uid() AND role = 'admin')
);
CREATE POLICY "Admins can manage announcements" ON announcements FOR ALL USING (
    EXISTS (SELECT 1 FROM admin_users WHERE id = auth.uid() AND role = 'admin')
);
CREATE POLICY "Admins can manage landing_page_content" ON landing_page_content FOR ALL USING (
    EXISTS (SELECT 1 FROM admin_users WHERE id = auth.uid() AND role = 'admin')
);
CREATE POLICY "Admins can manage admin_users" ON admin_users FOR ALL USING (
    EXISTS (SELECT 1 FROM admin_users WHERE id = auth.uid() AND role = 'admin')
);

-- Editors can update but not delete
CREATE POLICY "Editors can update members" ON members FOR UPDATE USING (
    EXISTS (SELECT 1 FROM admin_users WHERE id = auth.uid() AND role IN ('admin', 'editor'))
);
CREATE POLICY "Editors can update events" ON events FOR UPDATE USING (
    EXISTS (SELECT 1 FROM admin_users WHERE id = auth.uid() AND role IN ('admin', 'editor'))
);
CREATE POLICY "Editors can update partners" ON partners FOR UPDATE USING (
    EXISTS (SELECT 1 FROM admin_users WHERE id = auth.uid() AND role IN ('admin', 'editor'))
);
CREATE POLICY "Editors can update testimonials" ON testimonials FOR UPDATE USING (
    EXISTS (SELECT 1 FROM admin_users WHERE id = auth.uid() AND role IN ('admin', 'editor'))
);
CREATE POLICY "Editors can update announcements" ON announcements FOR UPDATE USING (
    EXISTS (SELECT 1 FROM admin_users WHERE id = auth.uid() AND role IN ('admin', 'editor'))
);
CREATE POLICY "Editors can update landing_page_content" ON landing_page_content FOR UPDATE USING (
    EXISTS (SELECT 1 FROM admin_users WHERE id = auth.uid() AND role IN ('admin', 'editor'))
);

-- Function to auto-create admin_users record on signup (trigger)
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.admin_users (id, email, role)
    VALUES (NEW.id, NEW.email, 'editor');
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for new user signup
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- STORAGE
-- Create storage bucket for media
INSERT INTO storage.buckets (id, name, public) VALUES ('media', 'media', true);

-- Storage policies
CREATE POLICY "Public can view media" ON storage.objects FOR SELECT USING (bucket_id = 'media');
CREATE POLICY "Authenticated can upload media" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'media' AND auth.role() = 'authenticated');
CREATE POLICY "Authenticated can update media" ON storage.objects FOR UPDATE USING (bucket_id = 'media' AND auth.role() = 'authenticated');
