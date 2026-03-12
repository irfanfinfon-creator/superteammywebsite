import { createClient } from '@/lib/supabase/server'
import DashboardStats from './dashboard-stats'

export default async function AdminDashboard() {
  const supabase = await createClient()

  if (!supabase) return null

  // Fetch counts on the Server (Instant load)
  const [members, partners, testimonials, events, announcements] = await Promise.all([
    supabase.from('members').select('*', { count: 'exact', head: true }),
    supabase.from('partners').select('*', { count: 'exact', head: true }),
    supabase.from('testimonials').select('*', { count: 'exact', head: true }),
    supabase.from('events').select('*', { count: 'exact', head: true }),
    supabase.from('announcements').select('*', { count: 'exact', head: true })
  ])

  const counts = {
    members: members.count || 0,
    partners: partners.count || 0,
    testimonials: testimonials.count || 0,
    events: events.count || 0,
    announcements: announcements.count || 0
  }

  return <DashboardStats counts={counts} />
}
