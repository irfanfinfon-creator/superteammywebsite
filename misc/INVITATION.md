# Admin Invitation System - Implementation Guide

This document summarizes the complete implementation of the secure Admin Invitation System. Use this as a reference to re-integrate the feature or troubleshoot the flow.

## 1. Core Objectives
- Allow existing admins to invite new users via email using Supabase Magic Links.
- Ensure new admins can set their own password upon clicking the link (even without an existing account).
- Secure administrative actions using the Supabase Service Role Key on the server side.
- Maintain a clean `admin_users` table synced with Supabase Auth.

---

## 2. Technical Stack & Components

### A. The Admin Client (`src/lib/supabase/admin.ts`)
Created a dedicated server-side client that bypasses Row Level Security (RLS) using the `SUPABASE_SERVICE_ROLE_KEY`.
- **Purpose**: Required for `auth.admin` functions (inviting/deleting users).

### B. Server Actions (`src/app/admin/admins/actions.ts`)
- `inviteAdmin(email)`: Sends an invitation email with a `redirectTo` pointing to `/setup-password`.
- `removeAdmin(userId)`: Hard-deletes a user from both Supabase Auth and the `public.admin_users` table.

### C. The Management UI (`src/app/admin/admins/`)
- `page.tsx`: Server component that fetches all current admins.
- `admins-client.tsx`: Interactive dashboard to view admins, open the invite modal, and delete users. 

### D. The Password Setup Page (`src/app/setup-password/page.tsx`)
- A custom, branded landing page that captures the `#access_token` from the invitation link and allows the user to run `supabase.auth.updateUser({ password })`.

---

## 3. Environment Variables (.env.local)
Ensure these are set:
```bash
# Needed for the Admin Client (found in Supabase Dashboard API Settings)
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Needed for Magic Link redirection
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

---

## 4. Required Supabase Configuration (CRITICAL)

### A. Redirect URLs
In Supabase Dashboard: **Authentication > URL Configuration > Redirect URLs**:
- Add `http://localhost:3000/setup-password`

### B. SMTP (Email Provider)
To avoid the 3-emails-per-hour limit, use a provider like **Resend**:
- **Host**: `smtp.resend.com`
- **Port**: `587`
- **Username**: `resend` (Must be literal)
- **Password**: (Your Resend API Key)
- **Sender Email**: Must match your verified email/domain in Resend.

---

## 5. Known Issues & Troubleshooting

### Logout Loop / "Invalid Credentials"
- **Cause**: Clicking an invite link while logged in as a different user swaps your browser session. Deleting that user while logged in causes a session crash.
- **Fix**: Clear site data/cookies in browser dev tools (Application tab) and log in fresh.

### Infinite Loading on Setup Page
- **Cause**: Clicking "Submit" before Supabase has finished initializing the session from the URL fragment.
- **Fix**: Wrap `updateUser` in a `try/catch` block and ensure `loading` state is reset even on failure.

### "Unique Constraint" Error
- **Cause**: Re-inviting an email that was deleted from Auth but still exists in the `public.admin_users` table.
- **Fix**: Run SQL to manually clear both:
  ```sql
  DELETE FROM public.admin_users WHERE email = 'target@email.com';
  DELETE FROM auth.users WHERE email = 'target@email.com';
  ```

---

## 6. Files Created/Modified
- `src/lib/supabase/admin.ts`
- `src/app/admin/admins/page.tsx`
- `src/app/admin/admins/admins-client.tsx`
- `src/app/admin/admins/actions.ts`
- `src/app/setup-password/page.tsx`
- `src/app/admin/admin-nav-client.tsx` (Sidebar link)
