'use client'

import { motion } from 'framer-motion'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faXTwitter, faTelegram, faInstagram, faDiscord } from "@fortawesome/free-brands-svg-icons"
import Link from 'next/link'
import { LandingPageContent } from '@/types'

interface CTASectionProps {
  content?: LandingPageContent | null
}

export function CTASection({ content }: CTASectionProps) {
  const title = content?.title || "No need to build alone. \n Build together with us"
  const subtitle = content?.content || "Join our community of builders, creators, and innovators shaping the future of decentralized technology in Malaysia."

  const socialLinks = [
    { icon: faTelegram, href: "https://t.me/SuperteamMY", label: "Telegram", color: "hover:text-[#26A5E4]" },
    { icon: faXTwitter, href: "https://x.com/SuperteamMY", label: "X (Twitter)", color: "hover:text-white" },
    { icon: faInstagram, href: "https://www.instagram.com/superteammy", label: "Instagram", color: "hover:text-[#E4405F]" },
    { icon: faDiscord, href: "https://discord.gg/superteam", label: "Discord", color: "hover:text-[#5865F2]" },
  ]

  return (
    <section className="relative py-24 lg:py-32 overflow-hidden bg-[url('/ctabg.svg')] bg-cover border-t line-gradient">
      <div className="container mx-auto px-4 relative z-10 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-white leading-[1.1] tracking-tight mb-10 max-w-3xl mx-auto whitespace-pre-line">
            {title}
          </h2>
          <p className="text-lg text-white max-w-xl leading-relaxed font-regular text-center mx-auto mb-10">
            {subtitle}
          </p>

          <div className="flex items-center justify-center gap-6 md:gap-8">
            {socialLinks.map((social) => (
              <Link
                key={social.label}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                className={`text-white transition-all duration-300 hover:scale-125 bg-white/10 p-3 rounded-2xl ${social.color}`}
                aria-label={social.label}
              >
                <FontAwesomeIcon icon={social.icon} className="text-3xl md:text-4xl" />
              </Link>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}
