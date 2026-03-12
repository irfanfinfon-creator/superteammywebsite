'use server'

import { createAdminClient } from '@/lib/supabase/server-admin'
import { revalidatePath } from 'next/cache'

export async function saveMemberAction(payload: Record<string, unknown>, id?: string) {
  const supabase = createAdminClient()
  
  if (id) {
    const { data, error } = await supabase
      .from('members')
      .update(payload)
      .eq('id', id)
      .select()
      .single()
      
    if (error) throw new Error(error.message)
    revalidatePath('/admin/members')
    return data
  } else {
    const { data, error } = await supabase
      .from('members')
      .insert([payload])
      .select()
      .single()
      
    if (error) throw new Error(error.message)
    revalidatePath('/admin/members')
    return data
  }
}

export async function deleteMemberAction(id: string) {
  const supabase = createAdminClient()
  const { error } = await supabase.from('members').delete().eq('id', id)
  
  if (error) throw new Error(error.message)
  revalidatePath('/admin/members')
  return { success: true }
}
