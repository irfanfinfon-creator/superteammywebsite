import { createClient } from '@/lib/supabase/server'
import PartnersClient from './partners-client'
import { Partner } from '@/types'

export default async function AdminPartnersPage() {
  const supabase = await createClient()

  if (!supabase) return null

  // Fetch data on the Server
  const { data } = await supabase
    .from('partners')
    .select('*')
    .order('created_at', { ascending: false })

  return <PartnersClient initialPartners={(data as Partner[]) || []} />
}
