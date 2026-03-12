import { createClient } from '@/lib/supabase/server'
import TestimonialsClient from './testimonials-client'
import { Testimonial } from '@/types'

export default async function AdminTestimonialsPage() {
  const supabase = await createClient()

  if (!supabase) return null

  // Fetch data on the Server
  const { data } = await supabase
    .from('testimonials')
    .select('*')
    .order('created_at', { ascending: false })

  return <TestimonialsClient initialTestimonials={(data as Testimonial[]) || []} />
}
