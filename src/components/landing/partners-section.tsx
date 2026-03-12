'use client'

import { motion } from 'framer-motion'
import { Partner } from '@/types'
import Image from 'next/image'

interface PartnersSectionProps {
  partners: Partner[]
}

export function PartnersSection({ partners }: PartnersSectionProps) {
  return (
    <section className="relative py-24 overflow-hidden border-t border-b line-gradient" id="projects-section">
      <div className="container mx-auto px-4 relative z-10 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-16"
        >
          <h2 className="text-3xl md:text-5xl font-black text-white tracking-tight mb-4">
            Trusted by Solana&rsquo;s Top Projects
          </h2>
          <p className="text-base md:text-lg text-white max-w-2xl mx-auto leading-relaxed font-regular">
            We have aided the teams in building their products and startups, initiating the headstart for their successful endeavor in their Web3 Journey.
          </p>
        </motion.div>

        <div className="flex flex-wrap justify-center items-center gap-12 md:gap-20 mb-12">
          {(partners.length > 0 ? partners : Array(5).fill(null)).map((partner, index) => (
            <motion.div
              key={partner?.id || index}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="relative group cursor-pointer"
            >

              {partner?.logo_url ? (
                <Image
                  src={partner.logo_url}
                  alt={partner.name}
                  width={120}
                  height={48}
                  unoptimized
                  className="h-8 md:h-12 w-auto relative z-10 group-hover:scale-110 transition-all duration-500"
                />
              ) : (
                <div className="h-8 md:h-12 w-8 md:w-12 bg-white/10 rounded flex items-center justify-center relative z-10">
                  <div className="w-6 md:w-8 h-6 md:h-8 bg-linear-to-br from-purple-500 to-pink-500 rounded-sm opacity-50 group-hover:opacity-100 transition-opacity" />
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
