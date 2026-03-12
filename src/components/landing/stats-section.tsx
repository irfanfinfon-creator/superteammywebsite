'use client'

import { motion, useInView, useSpring } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'

interface StatItem {
  value: string | number
  label: string
  suffix?: string | null
}

interface StatsContent {
  title?: string
  subtitle?: string
  metadata?: {
    items?: StatItem[]
  }
}

interface StatsSectionProps {
  content: StatsContent | null
}

function Counter({ value, suffix = '' }: { value: string | number; suffix?: string | null }) {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true })
  const [displayValue, setDisplayValue] = useState(0)
  const spring = useSpring(0, { duration: 2000 })

  useEffect(() => {
    if (isInView) {
      if (typeof value === 'number') {
        spring.set(value)
      }
    }
  }, [isInView, value, spring])

  useEffect(() => {
    const unsubscribe = spring.on('change', (latest) => {
      setDisplayValue(Math.round(latest))
    })
    return unsubscribe
  }, [spring])

  if (typeof value === 'string') {
    return (
      <span ref={ref}>
        {value}{suffix || ''}
      </span>
    )
  }

  return (
    <span ref={ref}>
      {displayValue.toLocaleString()}{suffix || ''}
    </span>
  )
}

const defaultStats: StatItem[] = [
  { value: 32, label: 'Members', suffix: '+' },
  { value: 52, label: 'Countries', suffix: '+' },
  { value: 100, label: 'Projects Built', suffix: '+' },
  { value: 100, label: 'Bounties Completed', suffix: '+' },
  { value: 10, label: 'Community Reach', suffix: 'K+' }
]

export function StatsSection({ content }: StatsSectionProps) {
  const stats = content?.metadata?.items || defaultStats

  return (
    <section className="relative py-10 overflow-hidden bg-black/50 border-t border-b line-gradient">
      <div className="container mx-auto px-4 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-8 lg:gap-30 justify-center items-center ">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="flex flex-col items-center text-center group hover:scale-105 transition-transform"
            >
              <div className="text-5xl md:text-6xl font-bold text-white mb-2 tracking-tight">
                <Counter value={stat.value} suffix={stat.suffix || ''} />
              </div>
              <div className="text-[10px] md:text-xs font-medium text-white uppercase tracking-[0.2em]">
                {stat.label}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
