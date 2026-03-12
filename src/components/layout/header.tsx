'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion } from 'framer-motion'
import { Menu, X } from 'lucide-react'
import { useState } from 'react'
import Image from 'next/image'


const navigation = [
  { name: 'Our Mission', href: '/#our-mission' },
  { name: 'Members', href: '/#members-section' },
  { name: 'Projects', href: '/#projects-section' },
  { name: 'Wall of Love', href: '/#wall-of-love' },
  { name: 'FAQs', href: '/#faq-section' },
]

export function Header() {
  const pathname = usePathname()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <header className="fixed top-14 left-1/2 -translate-x-1/2 z-50 w-[82%] max-w-8xl">
      <nav className="glass rounded-lg px-6 py-6">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="flex flex-col">
              <Image src="/SuperteamMYlogo.svg" alt="Logo" width={150} height={40} priority />
            </div>
          </Link>

          <div className="hidden md:flex items-center gap-10">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`relative text-xs font-black uppercase tracking-widest transition-colors `}
              >
                {item.name}
                {pathname === item.href && (
                  <motion.div
                    layoutId="navbar-indicator"
                    className="absolute -bottom-1 left-0 right-0 h-0.5 bg-linear-to-r from-red-400 to-blue-400 rounded-full"
                  />
                )}
              </Link>
            ))}
          </div>
          <button
            className="md:hidden text-white p-2"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="md:hidden mt-4 py-4 border-t border-white/10 space-y-4"
          >
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`block text-center py-2 text-sm font-black uppercase tracking-widest ${pathname === item.href ? 'text-white' : 'text-white'
                  }`}
                onClick={() => setMobileMenuOpen(false)}
              >
                {item.name}
              </Link>
            ))}
          </motion.div>
        )}
      </nav>
    </header>
  )
}
