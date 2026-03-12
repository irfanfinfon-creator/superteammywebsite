import { createClient } from '@/lib/supabase/server'
import AdminsClient from './admins-client'
import { redirect } from 'next/navigation'

export default async function AdminsPage() {
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

  const { data: admins } = await supabase
    .from('admin_users')
    .select('id, email, role, created_at')
    .order('created_at', { ascending: false })

  return <AdminsClient initialAdmins={admins || []} currentUserId={user.id} />
}
