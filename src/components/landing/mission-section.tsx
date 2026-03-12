'use client'

import { motion } from 'framer-motion'
import { LandingPageContent } from '@/types'

interface MissionSectionProps {
  content?: LandingPageContent | null
}

const defaultMissions = [
  {
    title: "Builder support & mentorship",
    description: "Personalized guidance for developers and creators building on Solana.",
  },
  {
    title: "Events & Hackathons",
    description: "Join our regular meetups, workshops, and global Solana hackathons.",
  },
  {
    title: "Grants & Funding",
    description: "Access to grants and investment opportunities for your Web3 projects.",
  },
  {
    title: "Public Goods",
    description: "Building open-source tools and infrastructure for the Malaysian ecosystem.",
  },
  {
    title: "Education",
    description: "Comprehensive learning resources for Solana and Web3 development.",
  },
  {
    title: "Ecosystem Partnerships",
    description: "Connecting local builders with global Solana ecosystem partners.",
  }
]

interface MissionItem {
  title: string
  description: string
}

export function MissionSection({ content }: MissionSectionProps) {
  const sectionTitle = content?.title || "Our Mission"
  const isMissionItems = (val: unknown): val is MissionItem[] => {
    return Array.isArray(val) && val.every(item => {
      return typeof item === 'object' && item !== null &&
        'title' in item && 'description' in item
    })
  }
  const missions: MissionItem[] = isMissionItems((content?.metadata as Record<string, unknown> | undefined)?.items)
    ? (content!.metadata as Record<string, unknown> & { items: MissionItem[] }).items
    : defaultMissions

  return (
    <section className="relative py-24 overflow-hidden bg-[url('/KLSiang.svg')] bg-cover bg-center border-t border-b line-gradient" id="our-mission">
      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-black text-white tracking-tight">{sectionTitle}</h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-16">
          {missions.map((mission, index) => (
            <motion.div
              key={mission.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="flex flex-col items-start gap-4 group hover:scale-105 transition-transform"
            >
              <div className="border-gradient border-l-2 pl-4">
                <h3 className="text-lg font-bold text-white mb-2 group-hover:text-blue-500 transition-colors">
                  {mission.title}
                </h3>
                <p className="text-sm text-white leading-relaxed font-regular">
                  {mission.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
