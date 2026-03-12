-- ==========================
-- TABLES
-- ==========================

CREATE TABLE IF NOT EXISTS public.members (
    id uuid DEFAULT extensions.uuid_generate_v4() PRIMARY KEY,
    name text NOT NULL,
    photo_url text,
    role text,
    company text,
    skills text[] DEFAULT '{}'::text[],
    twitter_url text,
    hackathon_wins integer DEFAULT 0,
    projects_built integer DEFAULT 0,
    grants_received integer DEFAULT 0,
    dao_contributions integer DEFAULT 0,
    bounties_completed integer DEFAULT 0,
    is_featured boolean DEFAULT false,
    created_at timestamptz DEFAULT now(),
    special_badge text[] DEFAULT '{}'::text[]
);

-- Allow public to INSERT into admin_users (for signup flow)
CREATE POLICY "Allow public insert for admin_users"
ON public.admin_users
FOR INSERT
TO public
WITH CHECK (true);


CREATE TABLE IF NOT EXISTS public.events (
    id uuid DEFAULT extensions.uuid_generate_v4() PRIMARY KEY,
    title text NOT NULL,
    description text,
    date timestamptz,
    location text,
    image_url text,
    luma_url text,
    is_upcoming boolean DEFAULT true,
    created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.partners (
    id uuid DEFAULT extensions.uuid_generate_v4() PRIMARY KEY,
    name text NOT NULL,
    logo_url text,
    website_url text,
    is_active boolean DEFAULT true,
    created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.testimonials (
    id uuid DEFAULT extensions.uuid_generate_v4() PRIMARY KEY,
    is_featured boolean DEFAULT false,
    created_at timestamptz DEFAULT now(),
    tweet_url text NOT NULL
);

CREATE TABLE IF NOT EXISTS public.announcements (
    id uuid DEFAULT extensions.uuid_generate_v4() PRIMARY KEY,
    title text NOT NULL,
    content text,
    image_url text,
    is_published boolean DEFAULT false,
    published_at timestamptz,
    created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.landing_page_content (
    id uuid DEFAULT extensions.uuid_generate_v4() PRIMARY KEY,
    section text NOT NULL UNIQUE,
    title text,
    subtitle text,
    content text,
    cta_text text,
    cta_url text,
    image_url text,
    metadata jsonb DEFAULT '{}'::jsonb,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.admin_users (
    id uuid NOT NULL PRIMARY KEY,
    email text NOT NULL,
    role text DEFAULT 'editor' CHECK (role = 'admin'),
    created_at timestamptz DEFAULT now()
);

ALTER TABLE public.admin_users
ADD CONSTRAINT admin_users_id_fkey FOREIGN KEY (id)
REFERENCES auth.users (id);

CREATE TABLE IF NOT EXISTS public.admin_invitations (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    token text NOT NULL UNIQUE,
    email text,
    invited_by uuid,
    status text DEFAULT 'pending' CHECK (status = ANY (ARRAY['pending','completed','expired'])),
    expires_at timestamptz,
    created_at timestamptz DEFAULT now()
);

ALTER TABLE public.admin_invitations
ADD CONSTRAINT admin_invitations_invited_by_fkey FOREIGN KEY (invited_by)
REFERENCES public.admin_users (id);

-- ==========================
-- ENABLE ROW LEVEL SECURITY (structure only)
-- ==========================

ALTER TABLE public.members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.partners ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.testimonials ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.announcements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.landing_page_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_invitations ENABLE ROW LEVEL SECURITY;