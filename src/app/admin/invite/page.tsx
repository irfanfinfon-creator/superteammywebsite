import { createClient } from '@/lib/supabase/server'
import InviteClient from './invite-client'
import { redirect } from 'next/navigation'

export default async function InvitePage() {
  const supabase = await createClient()

  if (!supabase) {
    redirect('/login')
  }

  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const { data: adminData } = await supabase
    .from('admin_users')
    .select('role')
    .eq('id', user.id)
    .single()

  if (!adminData || adminData.role !== 'admin') {
    redirect('/')
  }

  return <InviteClient userId={user.id} />
}
