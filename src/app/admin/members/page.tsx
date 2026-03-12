import { createClient } from '@/lib/supabase/server'
import MembersClient from './members-client'
import { Member } from '@/types'

export default async function AdminMembersPage() {
  const supabase = await createClient()

  if (!supabase) return null

  // Fetch data on the Server
  const { data } = await supabase
    .from('members')
    .select('*')
    .order('created_at', { ascending: false })

  return <MembersClient initialMembers={(data as Member[]) || []} />
}
