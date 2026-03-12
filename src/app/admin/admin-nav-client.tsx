'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import {
    LayoutDashboard,
    Users,
    Calendar,
    Handshake,
    MessageSquare,
    Bell,
    LogOut,
    Settings,
    UserPlus,
    Shield
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { createClient } from '@/lib/supabase/client'

const navigation = [
    { name: 'Dashboard', href: '/admin', icon: LayoutDashboard, roles: ['admin'] },
    { name: 'Members', href: '/admin/members', icon: Users, roles: ['admin'] },
    { name: 'Events', href: '/admin/events', icon: Calendar, roles: ['admin'] },
    { name: 'Partners', href: '/admin/partners', icon: Handshake, roles: ['admin'] },
    { name: 'Testimonials', href: '/admin/testimonials', icon: MessageSquare, roles: ['admin'] },
    { name: 'Announcements', href: '/admin/announcements', icon: Bell, roles: ['admin'] },
    { name: 'Content', href: '/admin/content', icon: Settings, roles: ['admin'] },
    { name: 'Invite Admin', href: '/admin/invite', icon: UserPlus, roles: ['admin'] },
    { name: 'Admins', href: '/admin/admins', icon: Shield, roles: ['admin'] },
]

interface AdminNavClientProps {
    role: 'admin' | null
}

export default function AdminNavClient({ role }: AdminNavClientProps) {
    const pathname = usePathname()
    const router = useRouter()
    const supabase = createClient()

    const handleSignOut = async () => {
        await supabase.auth.signOut()
        router.push('/login')
        router.refresh()
    }

    return (
        <>
            <nav className="p-4 space-y-1 flex-1 overflow-y-auto">
                {navigation
                    .filter(item => !role || item.roles.includes(role))
                    .map((item) => {
                        const isActive = pathname === item.href
                        return (
                            <Link
                                key={item.name}
                                href={item.href}
                                className={cn(
                                    'flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors',
                                    isActive
                                        ? 'bg-[#1a1a1a] text-white'
                                        : 'text-gray-300 hover:bg-[#1a1a1a] hover:text-white'
                                )}
                            >
                                <item.icon className="w-5 h-5" />
                                {item.name}
                            </Link>
                        )
                    })}
            </nav>

            <div className="p-4 border-t border-[#1a1a1a] space-y-2">
                <button
                    onClick={handleSignOut}
                    className="flex items-center justify-center w-full px-4 py-2 border border-[#333333] rounded-md text-gray-300 hover:bg-[#1a1a1a]"
                >
                    <LogOut className="w-4 h-4 mr-2" />
                    Sign Out
                </button>
                <Link href="/" className="flex items-center justify-center w-full px-4 py-2 text-sm text-gray-400 hover:text-white">
                    Back to Website
                </Link>
            </div>
        </>
    )
}
