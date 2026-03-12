'use client'

import { useState, useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { Member } from '@/types'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

import { MemberCard } from '@/components/members/member-card'

interface MembersSectionProps {
  members: Member[]
}

export function MembersSection({ members }: MembersSectionProps) {
  const [flippedId, setFlippedId] = useState<string | null>(null)
  const marqueeRef = useRef(null)
  const isMarqueeInView = useInView(marqueeRef, { once: true })

  const toggleFlip = (id: string) => {
    setFlippedId((prev) => (prev === id ? null : id))
  }

  return (
    <section className="relative py-24 overflow-hidden" id="members-section">
      {/* Marquee Keyframes (Animation play state managed in JS) */}
      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          display: flex;
          gap: 1.5rem; /* gap-6 */
          animation: marquee 60s linear infinite;
          width: max-content;
          will-change: transform;
        }
      `}</style>

      <div className="w-full mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-black text-white tracking-tight mb-8">
            Our Featured Members
          </h2>
        </motion.div>

        <div className="relative w-full overflow-hidden mb-16 px-4" ref={marqueeRef}>
          <div
            className={isMarqueeInView ? "animate-marquee py-8" : "flex gap-6 py-8 w-max"}
            style={{
              animationPlayState: flippedId ? 'paused' : 'running'
            }}
          >
            {[...members, ...members].map((member, index) => (
              <div key={`${member.id}-${index}`} className="w-[260px] sm:w-[300px] shrink-0">
                <MemberCard
                  member={member}
                  isFlipped={flippedId === member.id}
                  onToggleFlip={toggleFlip}
                  index={index}
                />
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-center">
          <Link href="/members">
            <Button size="lg" className="bg-white text-black  px-10 h-12 rounded-lg font-regular transition-all active:scale-95">
              View All Members
            </Button>
          </Link>
        </div>
      </div>
    </section>
  )
}
