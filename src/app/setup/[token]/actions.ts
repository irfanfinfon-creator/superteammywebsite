'use server'

import { createAdminClient } from '@/lib/supabase/server-admin'
import { getInvitationByToken } from '@/lib/supabase/data'

export async function createAdminUser(token: string, email: string, password: string) {
  const supabase = createAdminClient()

  // Get invitation first to validate
  const invitation = await getInvitationByToken(token)
  
  if (!invitation) {
    return { success: false, error: 'Invalid invitation' }
  }

  if (invitation.status !== 'pending') {
    return { success: false, error: 'Invitation already used or expired' }
  }

  const now = new Date()
  const expiresAt = new Date(invitation.expires_at)
  if (now > expiresAt) {
    return { success: false, error: 'Invitation has expired' }
  }

  // Create user with Admin API (bypasses RLS + email confirmation)
  const { data: userData, error: userError } = await supabase.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: {
      email: email,
    },
  })

  if (userError) {
    return { success: false, error: userError.message }
  }

  if (!userData.user) {
    return { success: false, error: 'Failed to create user' }
  }

  // Insert into admin_users table (use upsert to handle duplicates)
  const { error: adminError } = await supabase
    .from('admin_users')
    .upsert({
      id: userData.user.id,
      email: email,
      role: 'admin',
    }, {
      onConflict: 'id',
      ignoreDuplicates: false,
    })

  if (adminError) {
    return { success: false, error: adminError.message }
  }

  // Update invitation status
  const { error: updateError } = await supabase
    .from('admin_invitations')
    .update({
      status: 'completed',
      email: email,
    })
    .eq('id', invitation.id)

  if (updateError) {
    return { success: false, error: updateError.message }
  }

  return { success: true, error: null }
}
