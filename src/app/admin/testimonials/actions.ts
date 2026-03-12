'use server'

import { createAdminClient } from '@/lib/supabase/server-admin'
import { revalidatePath } from 'next/cache'

export async function saveTestimonialAction(payload: any, id?: string) {
  const supabase = createAdminClient()
  
  if (id) {
    const { data, error } = await supabase
      .from('testimonials')
      .update(payload)
      .eq('id', id)
      .select()
      .single()
      
    if (error) throw new Error(error.message)
    revalidatePath('/admin/testimonials')
    return data
  } else {
    const { data, error } = await supabase
      .from('testimonials')
      .insert([payload])
      .select()
      .single()
      
    if (error) throw new Error(error.message)
    revalidatePath('/admin/testimonials')
    return data
  }
}

export async function deleteTestimonialAction(id: string) {
  const supabase = createAdminClient()
  const { error } = await supabase.from('testimonials').delete().eq('id', id)
  
  if (error) throw new Error(error.message)
  revalidatePath('/admin/testimonials')
  return { success: true }
}
