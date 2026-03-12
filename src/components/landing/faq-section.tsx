'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'

interface FaqItem {
  question: string
  answer: string
}

interface FaqContent {
  title?: string
  subtitle?: string
  metadata?: {
    items?: FaqItem[]
  }
}

interface FAQSectionProps {
  content: FaqContent | null
}

const defaultFaqs: FaqItem[] = [
  {
    question: 'What is Superteam Malaysia?',
    answer: 'Superteam Malaysia is the local chapter of Superteam, a global community of Solana builders. We serve as the digital headquarters for Web3 developers, designers, and entrepreneurs in Malaysia, connecting them with opportunities, resources, and the broader Solana ecosystem.'
  },
  {
    question: 'How do I join?',
    answer: 'Join our community by connecting with us on Telegram, Discord, or Twitter. Fill out our membership form on the website to become an official member and gain access to exclusive events, bounties, and opportunities.'
  },
  {
    question: 'What opportunities are available?',
    answer: 'We offer various opportunities including hackathons, grants, bounties, mentorship programs, job listings, and networking events. Members can participate in building projects, attend workshops, and connect with potential investors and partners.'
  },
  {
    question: 'How can projects collaborate?',
    answer: 'Projects can collaborate through our community events, hackathons, and by joining our ecosystem. We regularly feature projects built by our members and help connect them with resources and partnerships.'
  },
  {
    question: 'Do I need to be a developer to join?',
    answer: 'No! We welcome builders of all backgrounds including developers, designers, product managers, marketers, content creators, and community managers. Web3 needs diverse skills to succeed.'
  }
]

export function FAQSection({ content }: FAQSectionProps) {
  const faqs = content?.metadata?.items || defaultFaqs

  return (
    <section className="relative py-24 lg:py-32 overflow-hidden border-t line-gradient" id="faq-section">
      <div className="container mx-auto px-4 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-24 items-center">
          {/* Left Column — Large Title */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="lg:col-span-4"
          >
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-white leading-[1.05] tracking-tight">
              Frequently<br />
              Asked
              Question
            </h2>
          </motion.div>

          {/* Right Column — Accordion */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="lg:col-span-8"
          >
            {faqs.map((faq, index) => (
              <FAQItem key={faq.question} {...faq} isFirst={index === 0} />
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  )
}

function FAQItem({ question, answer }: { question: string; answer: string; isFirst?: boolean }) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className={cn("border-b line-gradient")}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full py-6 flex items-center justify-between text-left transition-all duration-300 group"
      >
        <span className="text-xl md:text-xl font-regular text-white group-hover:text-white transition-colors">{question}</span>
        <div className={cn(
          "w-6 h-6 flex items-center justify-center transition-transform duration-300 ml-4 shrink-0",
          isOpen && "rotate-180"
        )}>
          <ChevronDown className="w-5 h-5 text-white/40" />
        </div>
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="pb-6 text-white leading-relaxed text-sm">
              {answer}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
