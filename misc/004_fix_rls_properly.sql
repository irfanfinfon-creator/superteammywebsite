-- Function to check if current user is an admin without triggering RLS recursion
CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1
    FROM admin_users
    WHERE id = auth.uid()
    AND role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Re-enable RLS on admin_users
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

-- Drop old policies
DROP POLICY IF EXISTS "Anyone can read own admin record" ON admin_users;
DROP POLICY IF EXISTS "Admins can manage admin_users" ON admin_users;

-- New non-recursive policies
CREATE POLICY "Users can view their own record"
ON admin_users FOR SELECT
TO authenticated
USING (auth.uid() = id);

CREATE POLICY "Admins can manage all records"
ON admin_users FOR ALL
TO authenticated
USING (is_admin());

-- Ensure other tables also use this optimized check
DROP POLICY IF EXISTS "Admins can manage members" ON members;
CREATE POLICY "Admins can manage members" ON members FOR ALL TO authenticated USING (is_admin());

DROP POLICY IF EXISTS "Admins can manage events" ON events;
CREATE POLICY "Admins can manage events" ON events FOR ALL TO authenticated USING (is_admin());

DROP POLICY IF EXISTS "Admins can manage partners" ON partners;
CREATE POLICY "Admins can manage partners" ON partners FOR ALL TO authenticated USING (is_admin());

DROP POLICY IF EXISTS "Admins can manage testimonials" ON testimonials;
CREATE POLICY "Admins can manage testimonials" ON testimonials FOR ALL TO authenticated USING (is_admin());

DROP POLICY IF EXISTS "Admins can manage announcements" ON announcements;
CREATE POLICY "Admins can manage announcements" ON announcements FOR ALL TO authenticated USING (is_admin());

DROP POLICY IF EXISTS "Admins can manage content" ON landing_page_content;
CREATE POLICY "Admins can manage content" ON landing_page_content FOR ALL TO authenticated USING (is_admin());
