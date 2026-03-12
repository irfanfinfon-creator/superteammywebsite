'use server'

import { createAdminClient } from '@/lib/supabase/server-admin'
import { revalidatePath } from 'next/cache'

export async function savePartnerAction(payload: any, id?: string) {
  const supabase = createAdminClient()
  
  if (id) {
    const { data, error } = await supabase
      .from('partners')
      .update(payload)
      .eq('id', id)
      .select()
      .single()
      
    if (error) throw new Error(error.message)
    revalidatePath('/admin/partners')
    return data
  } else {
    const { data, error } = await supabase
      .from('partners')
      .insert([payload])
      .select()
      .single()
      
    if (error) throw new Error(error.message)
    revalidatePath('/admin/partners')
    return data
  }
}

export async function deletePartnerAction(id: string) {
  const supabase = createAdminClient()
  const { error } = await supabase.from('partners').delete().eq('id', id)
  
  if (error) throw new Error(error.message)
  revalidatePath('/admin/partners')
  return { success: true }
}
