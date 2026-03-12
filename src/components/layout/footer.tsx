'use client'

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXTwitter, faTelegram, faInstagram } from "@fortawesome/free-brands-svg-icons";
import Link from 'next/link'

export default function TwitterIcon() {
  return <FontAwesomeIcon icon={faXTwitter} />;
}

export function Footer() {
  return (
    <footer className="relative py-20 overflow-hidden border-t border-gradient">
      <div className="container mx-auto px-4 relative z-10">
        <div className="gap-12 mb-16 flex flex-col md:flex-row justify-between">
          {/* Brand & Description */}
          <div className="lg:col-span-4 flex flex-col items-start">
            <Link href="/" className="inline-block mb-4">
              <div className="flex flex-col">
                <img src="/SuperteamMYlogo.svg" alt="Logo" width={217} height="auto" />
              </div>
            </Link>
            <p className="text-sm text-white leading-relaxed mb-6 max-w-xs">
              The digital headquarters for Solana builders in Malaysia. Connecting top talent with the global Solana ecosystem.
            </p>
            <div className="flex gap-3">
              <a href="https://x.com/SuperteamMY" target="_blank" className="flex items-center justify-center text-white hover:text-white hover:scale-110% transition-all">
                <FontAwesomeIcon icon={faXTwitter} className="text-2xl" />
              </a>
              <a href="https://t.me/SuperteamMY" target="_blank" className="flex items-center justify-center text-white hover:text-white hover:scale-110% transition-all">
                <FontAwesomeIcon icon={faTelegram} className="text-2xl" />
              </a>
              <a href="https://www.instagram.com/superteammy" target="_blank" className="flex items-center justify-center text-white hover:text-white hover:scale-110% transition-all">
                <FontAwesomeIcon icon={faInstagram} className="text-2xl" />
              </a>
              <a href="https://luma.com/mysuperteam" target="_blank" className="flex items-center justify-center text-white hover:text-white hover:scale-110% transition-all text-2xl">
                ✦
              </a>
            </div>
          </div>

          {/* Ecosystem */}
          <div className="lg:col-span-2">
            <h4 className="text-white font-bold text-sm uppercase mb-6">Quick Links</h4>
            <ul>
              <li><Link href="#our-mission" className="text-white hover:text-white text-sm transition-colors">Our Mission</Link></li>
              <li><Link href="#events-section" className="text-white hover:text-white text-sm transition-colors">Events</Link></li>
              <li><Link href="#members-section" className="text-white hover:text-white text-sm transition-colors">Members</Link></li>
              <li><Link href="#projects-section" className="text-white hover:text-white text-sm transition-colors">Projects</Link></li>
              <li><Link href="#wall-of-love" className="text-white hover:text-white text-sm transition-colors">Wall of Love</Link></li>
              <li><Link href="#faq-section" className="text-white hover:text-white text-sm transition-colors">FAQs</Link></li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-gradient flex flex-col md:flex-row justify-between items-center gap-4 text-[10px] text-white/20 uppercase tracking-widest">
          <div className="text-white">© 2026 Superteam Malaysia. All rights reserved.</div>
          <div className="flex gap-8">
            <Link href="https://superteam.fun" target="_blank" className="text-white hover:text-blue-200 transition-colors">Global Superteam ↗</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
