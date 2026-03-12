'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useState } from 'react'
import { Calendar, MapPin } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Event } from '@/types'
import Link from 'next/link'
import Image from 'next/image'
import dynamic from 'next/dynamic'

interface EventsSectionProps {
  events: Event[]
}

const ClientTime = dynamic(() => import('@/components/client/time').then(m => m.ClientTime), { ssr: false })

export function EventsSection({ events }: EventsSectionProps) {
  const [activeTab, setActiveTab] = useState<'upcoming' | 'past'>('upcoming')

  const list = Array.isArray(events) ? events : []
  const upcomingEvents = list.filter((e) => e && e.is_upcoming)
  const pastEvents = list.filter((e) => e && !e.is_upcoming)
  const displayedEvents = activeTab === 'upcoming' ? upcomingEvents : pastEvents

  return (
    <section className="relative py-24 overflow-hidden bg-[url('/background.svg')] bg-cover bg-center bg-no-repeat" id="events-section">
      <div className="container mx-auto px-4 relative z-10">

        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-12"
        >
          <div className="mb-0 flex flex-col items-center justify-center">
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-4 leading-[1.15] tracking-tight text-center">
              Join and Connect With us in <br className="hidden md:block" />
              <span className="text-gradient"> Upcoming Events</span>
            </h2>
            <p className="text-lg text-white max-w-xl leading-relaxed font-regular tracking-tight text-center">
              Connect with builders, designers, and creators from the community through our regular meetups and workshops.
            </p>
          </div>
        </motion.div>

        {/* Toggle Switches */}
        <div className="flex justify-center mb-12">
          <div className="bg-[#111111] p-1 rounded-xl border border-white/5 grid grid-cols-2 gap-1 w-fit">
            <button
              onClick={() => setActiveTab('upcoming')}
              className={`px-6 py-2.5 rounded-lg text-sm font-medium transition-all ${activeTab === 'upcoming'
                ? 'bg-white text-black shadow-lg text-center'
                : 'text-white/60 hover:text-white text-center'
                }`}
            >
              Upcoming
            </button>
            <button
              onClick={() => setActiveTab('past')}
              className={`px-6 py-2.5 rounded-lg text-sm font-medium transition-all ${activeTab === 'past'
                ? 'bg-white text-black shadow-lg text-center'
                : 'text-white/60 hover:text-white text-center'
                }`}
            >
              Past
            </button>
          </div>
        </div>

        {/* Event Cards */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, x: activeTab === 'upcoming' ? -20 : 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: activeTab === 'upcoming' ? 20 : -20 }}
            transition={{ duration: 0.3 }}
          >
            {displayedEvents.length > 0 ? (
              <div className="space-y-4 mb-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {displayedEvents.map((event, index) => (
                  <motion.div
                    key={event.id ?? index}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                  >
                    <Link
                      href={event.luma_url || '#'}
                      target={event.luma_url ? '_blank' : undefined}
                      rel="noopener noreferrer"
                      className=" gap-0 transition-all duration-300"
                    >
                      {/* Event Image */}
                      <div className="gradient-border">
                        <div className="bg-black rounded-2xl overflow-hidden">
                          {event.image_url ? (
                            <div className="sm:w-full sm:h-auto shrink-0 aspect-square overflow-hidden relative">
                              <Image
                                src={event.image_url}
                                alt={event.title}
                                fill
                                unoptimized
                                className="object-cover group-hover:scale-110 transition-transform duration-500"
                              />
                            </div>
                          ) : (
                            <div className="sm:w-56 h-44 sm:h-auto shrink-0 flex items-center justify-center">
                            </div>
                          )}

                          {/* Event Details */}
                          <div className="flex flex-1 items-center justify-between px-6 py-5 gap-4">
                            <div className="flex-1 min-w-0">
                              <p className="text-white font-bold text-lg leading-tight mb-2 transition-colors truncate">
                                {event.title}
                              </p>

                              <div className="items-center gap-x-4 gap-y-1 mb-3">
                                {event.date && (
                                  <span className="flex items-center gap-1.5 text-white/60 text-sm">
                                    <Calendar className="w-3.5 h-3.5 text-white/40" />
                                    <time
                                      dateTime={event.date ?? undefined}
                                      suppressHydrationWarning
                                      className="inline"
                                    >
                                      <ClientTime dateStr={event.date} />
                                    </time>
                                  </span>
                                )}
                                {event.location && (
                                  <span className="flex items-center gap-1.5 text-white/60 text-sm">
                                    <MapPin className="w-3.5 h-3.5 text-white/40" />
                                    {event.location}
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="mb-10 py-16 border border-white/10 rounded-2xl text-center text-white/30">
                {activeTab === 'upcoming'
                  ? 'No upcoming events at the moment. Check back soon!'
                  : 'No past events found.'}
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Explore All CTA */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
        >
        </motion.div>
        <div className="flex justify-center">
          <Link href="https://lu.ma/mysuperteam" target="_blank">
            <Button
              size="lg"
              className="bg-white text-black px-10 h-12 rounded-lg font-regular transition-all hover:scale-105 active:scale-95 shadow-xl"
            >
              Explore All Events
            </Button>
          </Link>
        </div>
      </div>
    </section>
  )
}
