'use server'

import { createAdminClient } from '@/lib/supabase/server-admin'
import { revalidatePath } from 'next/cache'

export async function saveAnnouncementAction(payload: Record<string, unknown>, id?: string) {
  const supabase = createAdminClient()
  
  if (id) {
    const { data, error } = await supabase
      .from('announcements')
      .update(payload)
      .eq('id', id)
      .select()
      .single()
      
    if (error) throw new Error(error.message)
    revalidatePath('/admin/announcements')
    return data
  } else {
    const { data, error } = await supabase
      .from('announcements')
      .insert([payload])
      .select()
      .single()
      
    if (error) throw new Error(error.message)
    revalidatePath('/admin/announcements')
    return data
  }
}

export async function deleteAnnouncementAction(id: string) {
  const supabase = createAdminClient()
  const { error } = await supabase.from('announcements').delete().eq('id', id)
  
  if (error) throw new Error(error.message)
  revalidatePath('/admin/announcements')
  return { success: true }
}

export async function publishAnnouncementAction(id: string) {
  const supabase = createAdminClient()
  const { data, error } = await supabase
    .from('announcements')
    .update({
      is_published: true,
      published_at: new Date().toISOString()
    })
    .eq('id', id)
    .select()
    .single()
    
  if (error) throw new Error(error.message)
  revalidatePath('/admin/announcements')
  return data
}
