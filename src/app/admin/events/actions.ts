'use server'

import { createAdminClient } from '@/lib/supabase/server-admin'
import { revalidatePath } from 'next/cache'

export async function saveEventAction(payload: any, id?: string) {
  const supabase = createAdminClient()
  
  if (id) {
    const { data, error } = await supabase
      .from('events')
      .update(payload)
      .eq('id', id)
      .select()
      .single()
      
    if (error) throw new Error(error.message)
    revalidatePath('/admin/events')
    return data
  } else {
    const { data, error } = await supabase
      .from('events')
      .insert([payload])
      .select()
      .single()
      
    if (error) throw new Error(error.message)
    revalidatePath('/admin/events')
    return data
  }
}

export async function deleteEventAction(id: string) {
  const supabase = createAdminClient()
  const { error } = await supabase.from('events').delete().eq('id', id)
  
  if (error) throw new Error(error.message)
  revalidatePath('/admin/events')
  return { success: true }
}

export async function toggleEventUpcomingAction(id: string, isUpcoming: boolean) {
  const supabase = createAdminClient()
  const { data, error } = await supabase
    .from('events')
    .update({ is_upcoming: isUpcoming })
    .eq('id', id)
    .select()
    .single()
    
  if (error) throw new Error(error.message)
  revalidatePath('/admin/events')
  return data
}
