'use client'

import { motion } from 'framer-motion'
import { LandingPageContent } from '@/types'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

interface HeroSectionProps {
  content?: LandingPageContent | null
}

export function HeroSection({ content }: HeroSectionProps) {
  const title = content?.title
  const subtitle = content?.subtitle

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-[url('/KLSenja.svg')] bg-cover bg-center">
      {/* Background Elements */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-purple-600/20 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-pink-600/20 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-[0.05]" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="flex flex-col items-start gap-8 md:gap-12">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="flex-1 text-left"
          >
            <div className="text-base font-medium mb-4">
              <span className="text-gradient">
                Superteam Malaysia
              </span>
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-regular text-white tracking-tighter mb-4 leading-[0.95] max-w-3xl">
              <span className="font-bold">{title}</span>
            </h1>

            <p className="text-base md:text-lg lg:text-xl text-white mb-6 max-w-2xl leading-relaxed">
              {subtitle}
            </p>

            <div className="flex items-center gap-4">
              <Link href="https://t.me/SuperteamMY" target="_blank">
                <Button
                  size="lg"
                  className="bg-white text-black px-10 h-12 rounded-lg font-regular transition-all hover:scale-105 active:scale-95 shadow-xl"
                >
                  Join Community
                </Button>
              </Link>
              <Link href="#our-mission">
                <Button
                  size="lg"
                  className="bg-white/40 px-10 h-12 rounded-lg font-regular transition-all hover:scale-105 active:scale-95 shadow-xl"
                >
                  <p className="text-white">Explore Opportunities</p>
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
