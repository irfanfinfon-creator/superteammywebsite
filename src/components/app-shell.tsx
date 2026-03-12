'use client'

import { usePathname } from 'next/navigation'
import { Header } from '@/components/layout/header'
import dynamic from 'next/dynamic'

const AnnouncementBarNoSSR = dynamic(
  () => import('@/components/landing/announcement-bar').then(m => m.AnnouncementBar),
  { ssr: false }
)

interface Announcement {
  title: string
  content: string
}

interface AppShellProps {
  children: React.ReactNode
  announcements: Announcement[]
}

export function AppShell({ children, announcements }: AppShellProps) {
  const pathname = usePathname()

  const hideHeader =
    pathname.startsWith('/admin') ||
    pathname.startsWith('/setup') ||
    pathname.startsWith('/setup-password') ||
    pathname === '/login' ||
    pathname === '/events'

  const showAnnouncementBar = 
    !pathname.startsWith('/admin') &&
    !pathname.startsWith('/setup') &&
    !pathname.startsWith('/setup-password') &&
    pathname !== '/login' &&
    pathname !== '/events'

  return (
    <>
      {showAnnouncementBar && <AnnouncementBarNoSSR announcements={announcements} />}
      {!hideHeader && <Header />}
      <div>
        {children}
      </div>
    </>
  )
}

