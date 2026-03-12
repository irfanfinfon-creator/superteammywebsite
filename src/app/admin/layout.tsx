import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import AdminNavClient from './admin-nav-client'
import { redirect } from 'next/navigation'

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()

  if (!supabase) {
    redirect('/login')
  }

  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // Fetch the role immediately on the server
  const { data: adminData } = await supabase
    .from('admin_users')
    .select('role')
    .eq('id', user.id)
    .single()

  const role = adminData?.role || null

  return (
    <div className="flex h-screen overflow-hidden">
      <aside className="w-64 shrink-0 bg-[#111111] relative flex flex-col">
        <div className="p-6 border-b border-[#1a1a1a]">
          <Link href="/" className="flex items-center gap-2">
            <img src="/SuperteamMYlogo.svg" alt="Logo" className='w-32 h-10' />
          </Link>
        </div>

        {/* Sidebar content is now pre-rendered with the correct role */}
        <AdminNavClient role={role} />
      </aside>

      <main className="flex-1 overflow-auto bg-[#040507]">
        <div className="p-8">
          {children}
        </div>
      </main>
    </div>
  )
}
