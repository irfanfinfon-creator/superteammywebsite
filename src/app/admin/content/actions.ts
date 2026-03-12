'use server'

import { createAdminClient } from '@/lib/supabase/server-admin'
import { revalidatePath } from 'next/cache'

export async function saveContentAction(payload: Record<string, unknown>, id?: string) {
  const supabase = createAdminClient()
  
  if (id) {
    const { data, error } = await supabase
      .from('landing_page_content')
      .update(payload)
      .eq('id', id)
      .select()
      
    if (error) throw new Error(error.message)
    revalidatePath('/')
    revalidatePath('/admin/content')
    return data
  } else {
    const { data, error } = await supabase
      .from('landing_page_content')
      .insert([payload])
      .select()
      
    if (error) throw new Error(error.message)
    revalidatePath('/')
    revalidatePath('/admin/content')
    return data
  }
}

export async function getAllContentAction() {
  const supabase = createAdminClient()
  const { data, error } = await supabase.from('landing_page_content').select('*')
  if (error) throw new Error(error.message)
  return data
}
