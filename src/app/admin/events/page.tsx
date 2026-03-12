import { createClient } from '@/lib/supabase/server'
import EventsClient from './events-client'
import { Event } from '@/types'

export default async function AdminEventsPage() {
    const supabase = await createClient()

    if (!supabase) return null

    const { data } = await supabase
        .from('events')
        .select('*')
        .order('date', { ascending: true })

    const events: Event[] = (data as Event[]) || []

    return <EventsClient initialEvents={events} />
}
