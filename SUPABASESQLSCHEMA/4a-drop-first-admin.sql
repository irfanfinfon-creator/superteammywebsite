-- ============================================================
-- DROP / REMOVE FIRST ADMIN
-- ============================================================
-- Use this SQL to remove admin access (for testing purposes).
-- After running this, the user will no longer have access to CMS.
-- ============================================================

-- Option A: Remove admin by email
-- ============================================================
DELETE FROM public.admin_users 
WHERE email = 'your-email@example.com';


-- Option B: Remove admin by User ID
-- ============================================================
-- DELETE FROM public.admin_users 
-- WHERE id = 'YOUR-AUTH-USER-ID-HERE';


-- Option C: Remove ALL admins (be careful!)
-- ============================================================
-- DELETE FROM public.admin_users;


-- Also clear any pending invitations (optional)
-- ============================================================
-- DELETE FROM public.admin_invitations 
-- WHERE status = 'pending';
