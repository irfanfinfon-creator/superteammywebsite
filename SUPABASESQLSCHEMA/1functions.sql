-- Function: generate_invite_token
CREATE OR REPLACE FUNCTION public.generate_invite_token()
RETURNS text
LANGUAGE sql
AS $$
  SELECT 'st-' || LEFT(gen_random_uuid()::text, 8);
$$;

-- Function: get_auth_role
CREATE OR REPLACE FUNCTION public.get_auth_role()
RETURNS text
LANGUAGE sql
AS $$
  SELECT role FROM public.admin_users WHERE id = auth.uid();
$$;

-- Function: handle_new_user
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
    INSERT INTO public.admin_users (id, email, role)
    VALUES (NEW.id, NEW.email, 'admin');
    RETURN NEW;
END;
$$;

-- Function: is_admin
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Bypass RLS inside the query
  RETURN EXISTS (
    SELECT 1 FROM public.admin_users
    WHERE id = auth.uid() AND role = 'admin'
  );
END;
$$;