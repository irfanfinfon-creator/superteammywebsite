'use client'

import { motion } from 'framer-motion'
import { Users, Handshake, MessageSquare, TrendingUp, ArrowRight, Calendar, Megaphone, Quote } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import Link from 'next/link'

interface DashboardStatsProps {
    counts: {
        members: number
        partners: number
        events: number
        announcements: number
        testimonials: number
    }
}

export default function DashboardStats({ counts }: DashboardStatsProps) {
    const stats = [
        { title: 'Total Members', value: counts.members, icon: Users, color: 'bg-purple-500' },
        { title: 'Events', value: counts.events, icon: Calendar, color: 'bg-pink-500' },
        { title: 'Partners', value: counts.partners, icon: Handshake, color: 'bg-green-500' },
        { title: 'Testimonials', value: counts.testimonials, icon: Quote, color: 'bg-yellow-500' },
        { title: 'Announcements', value: counts.announcements, icon: Megaphone, color: 'bg-blue-500' },
    ]

    const recentActivity = [
        { type: 'member', message: 'New member integration complete', time: 'Active' },
        { type: 'announcement', message: 'CMS content updated', time: 'Just now' },
        { type: 'partner', message: 'Ecosystem grid updated', time: 'Recently' },
    ]

    return (
        <div>
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-white">Dashboard</h1>
                <p className="text-gray-400">Welcome to the Superteam Malaysia Admin Panel</p>
                <div className="flex items-center mt-4 text-sm">
                    <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                    <span className="text-green-500 font-medium">Real-time</span>
                    <span className="text-gray-400 ml-1">data synced</span>
                </div>

            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-6 mb-8">
                {stats.map((stat, index) => (
                    <motion.div
                        key={stat.title}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: index * 0.1 }}
                    >
                        <Card className="bg-[#111111] border-[#1a1a1a]">
                            <CardContent className="p-6">
                                <div className="flex items-center gap-4">
                                    <div className={`w-12 h-12 rounded-lg ${stat.color} flex items-center justify-center`}>
                                        <stat.icon className="w-6 h-6 text-white" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-400">{stat.title}</p>
                                        <p className="text-2xl font-bold text-white mt-1">{stat.value}</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                <Card className="bg-[#111111] border-[#1a1a1a]">
                    <CardHeader>
                        <CardTitle className="text-white">System Status</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {recentActivity.map((activity, index) => (
                                <div key={index} className="flex items-start gap-4 pb-4 border-b border-[#1a1a1a] last:border-0">
                                    <div className="w-2 h-2 rounded-full bg-green-500 mt-2" />
                                    <div>
                                        <p className="text-sm font-medium text-white">{activity.message}</p>
                                        <p className="text-xs text-gray-400">{activity.time}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-[#111111] border-[#1a1a1a] xl:col-span-2">
                    <CardHeader>
                        <CardTitle className="text-white">Quick Actions</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-2 gap-4">
                            <Link href="/admin/members" className="p-4 bg-purple-500/60 rounded-lg text-left hover:bg-purple-500/80 transition-colors group">
                                <Users className="w-6 h-6 text-white mb-2" />
                                <p className="font-medium text-white">Manage Members</p>
                                <p className="text-xs text-gray-300 flex items-center gap-1 group-hover:gap-2 transition-all">
                                    Go to members <ArrowRight className="w-3 h-3" />
                                </p>
                            </Link>
                            <Link href="/admin/events" className="p-4 bg-pink-500/60 rounded-lg text-left hover:bg-pink-500/80 transition-colors group">
                                <Handshake className="w-6 h-6 text-white mb-2" />
                                <p className="font-medium text-white">Manage Events</p>
                                <p className="text-xs text-gray-300 flex items-center gap-1 group-hover:gap-2 transition-all">
                                    Go to events <ArrowRight className="w-3 h-3" />
                                </p>
                            </Link>
                            <Link href="/admin/partners" className="p-4 bg-green-500/60 rounded-lg text-left hover:bg-green-500/80 transition-colors group">
                                <Handshake className="w-6 h-6 text-white mb-2" />
                                <p className="font-medium text-white">Manage Partners</p>
                                <p className="text-xs text-gray-300 flex items-center gap-1 group-hover:gap-2 transition-all">
                                    Go to partners <ArrowRight className="w-3 h-3" />
                                </p>
                            </Link>
                            <Link href="/admin/testimonials" className="p-4 bg-yellow-500/60 rounded-lg text-left hover:bg-yellow-500/80 transition-colors group">
                                <Quote className="w-6 h-6 text-white mb-2" />
                                <p className="font-medium text-white">Manage Testimonials</p>
                                <p className="text-xs text-gray-300 flex items-center gap-1 group-hover:gap-2 transition-all">
                                    Go to testimonials <ArrowRight className="w-3 h-3" />
                                </p>
                            </Link>
                            <Link href="/admin/announcements" className="p-4 bg-blue-500/60 rounded-lg text-left hover:bg-blue-500/80 transition-colors group">
                                <Megaphone className="w-6 h-6 text-white mb-2" />
                                <p className="font-medium text-white">Manage Announcements</p>
                                <p className="text-xs text-gray-300 flex items-center gap-1 group-hover:gap-2 transition-all">
                                    Go to announcements <ArrowRight className="w-3 h-3" />
                                </p>
                            </Link>
                            <Link href="/admin/content" className="p-4 bg-red-400/60 rounded-lg text-left hover:bg-red-400/80 transition-colors group">
                                <MessageSquare className="w-6 h-6 text-white mb-2" />
                                <p className="font-medium text-white">Manage Contents</p>
                                <p className="text-xs text-gray-300 flex items-center gap-1 group-hover:gap-2 transition-all">
                                    Go to Contents <ArrowRight className="w-3 h-3" />
                                </p>
                            </Link>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
