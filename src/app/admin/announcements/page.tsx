import { createClient } from '@/lib/supabase/server'
import AnnouncementsClient from './announcements-client'
import { Announcement } from '@/types'

export default async function AdminAnnouncementsPage() {
  const supabase = await createClient()

  if (!supabase) return null

  // Fetch data on the Server
  const { data } = await supabase
    .from('announcements')
    .select('*')
    .order('created_at', { ascending: false })

  return <AnnouncementsClient initialAnnouncements={(data as Announcement[]) || []} />
}
