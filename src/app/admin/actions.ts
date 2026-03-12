'use server'

import { createAdminClient } from '@/lib/supabase/server-admin'
import { revalidatePath } from 'next/cache'

// Admin User Actions
export async function getAllAdminsAction() {
  const supabase = createAdminClient()
  const { data, error } = await supabase
    .from('admin_users')
    .select('id, email, role, created_at')
    .order('created_at', { ascending: false })
  
  if (error) throw new Error(error.message)
  return data
}

export async function deleteAdminAction(id: string) {
  const supabase = createAdminClient()
  const { error } = await supabase
    .from('admin_users')
    .delete()
    .eq('id', id)
  
  if (error) throw new Error(error.message)
  revalidatePath('/admin/admins')
  return { success: true }
}

// Invitation Actions
export async function getPendingInvitationsAction() {
  const supabase = createAdminClient()
  const { data, error } = await supabase
    .from('admin_invitations')
    .select('id, token, email, invited_by, status, expires_at, created_at')
    .eq('status', 'pending')
    .order('created_at', { ascending: false })
  
  if (error) throw new Error(error.message)
  return data
}

export async function createInvitationAction(invitedById: string) {
  const supabase = createAdminClient()
  
  const expiresAt = new Date()
  expiresAt.setDate(expiresAt.getDate() + 7)
  
  const token = 'st-' + crypto.randomUUID().substring(0, 8)
  
  const { data, error } = await supabase
    .from('admin_invitations')
    .insert({
      token: token,
      invited_by: invitedById,
      expires_at: expiresAt.toISOString()
    })
    .select()
    .single()
  
  if (error) throw new Error(error.message)
  revalidatePath('/admin/invite')
  return data
}

export async function deleteInvitationAction(id: string) {
  const supabase = createAdminClient()
  const { error } = await supabase
    .from('admin_invitations')
    .delete()
    .eq('id', id)
  
  if (error) throw new Error(error.message)
  revalidatePath('/admin/invite')
  return { success: true }
}

// Storage Actions
export async function uploadFileAction(formData: FormData) {
  const supabase = createAdminClient()
  const file = formData.get('file') as File
  const bucket = (formData.get('bucket') as string) || 'media'
  const folder = (formData.get('folder') as string) || 'images'

  if (!file) throw new Error('No file provided')

  const fileExt = file.name.split('.').pop()
  const fileName = `${Math.random()}.${fileExt}`
  const filePath = `${folder}/${fileName}`

  const arrayBuffer = await file.arrayBuffer()
  const buffer = Buffer.from(arrayBuffer)

  const { error } = await supabase.storage
    .from(bucket)
    .upload(filePath, buffer, {
      contentType: file.type,
      upsert: true
    })

  if (error) throw new Error(error.message)

  const { data: { publicUrl } } = supabase.storage
    .from(bucket)
    .getPublicUrl(filePath)

  return publicUrl
}
