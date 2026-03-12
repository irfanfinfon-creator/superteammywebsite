'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Search } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Footer } from '@/components/layout/footer'
import { Member } from '@/types'
import { cn } from '@/lib/utils'
import { MemberCard } from '@/components/members/member-card'

interface MembersClientProps {
  initialMembers: Member[]
}

const filters = [
  'All',
  'Core Team',
  'Rust',
  'Frontend',
  'Design',
  'Content',
  'Growth',
  'Product',
  'Community',
  'Solana Builder',
  'Hackathon Winner',
  'Core Contributor'
]

export default function MembersClient({ initialMembers }: MembersClientProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [activeFilter, setActiveFilter] = useState('All')
  const [flippedId, setFlippedId] = useState<string | null>(null)

  const toggleFlip = (id: string) => {
    setFlippedId((prev) => (prev === id ? null : id))
  }

  const filteredMembers = initialMembers.filter((member) => {
    const q = searchQuery.toLowerCase()
    const matchesSearch = member.name.toLowerCase().includes(q) ||
      (member.role?.toLowerCase().includes(q) ?? false) ||
      (member.company?.toLowerCase().includes(q) ?? false)

    const norm = activeFilter.toLowerCase()
    const skillMatch = member.skills?.some(skill => skill.toLowerCase() === norm)
    const badgeMatch = member.special_badge?.some?.((b) => b.toLowerCase() === norm) ?? false
    const matchesFilter = activeFilter === 'All' || skillMatch || badgeMatch

    return matchesSearch && matchesFilter
  })

  return (
    <div className="min-h-screen">
      <div className="relative py-24 lg:py-40 overflow-hidden">
        {/* Background elements */}
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full blur-[120px]" />

        <div className="container mx-auto px-4 relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-5xl md:text-8xl font-black text-white mb-8 tracking-tighter leading-[0.9]">
              MEET OUR TALENTED <br />
              BUILDERS & CREATORS OF <br />
              <span className="text-gradient">SUPERTEAM MALAYSIA</span>
            </h1>
            <p className="text-xl md:text-2xl text-purple-100/60 max-w-2xl mx-auto leading-relaxed">
              Meet the amazing people pushing the boundaries of Web3 in Malaysia.
            </p>
          </motion.div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="flex flex-col gap-10 mb-16">
          <div className="relative max-w-2xl mx-auto w-full group">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-6 h-6 text-blue-500 group-focus-within:text-white transition-colors" />
            <Input
              placeholder="Search members by name, role, or company..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-16 h-16 rounded-full glass border-white/10 text-lg group-focus-within:border-blue-500/50 transition-all outline-none"
            />
          </div>

          <div className="flex flex-wrap justify-center gap-3">
            {filters.map((filter) => (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={cn(
                  "px-6 py-2 rounded-full text-xs font-black uppercase tracking-widest transition-all duration-300",
                  activeFilter === filter
                    ? "bg-white text-black shadow-xl shadow-white/10 scale-105"
                    : "glass text-white hover:text-white hover:bg-white/5 border-white/5"
                )}
              >
                {filter}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6 lg:gap-8">
          {filteredMembers.map((member, index) => (
            <MemberCard
              key={member.id}
              member={member}
              isFlipped={flippedId === member.id}
              onToggleFlip={toggleFlip}
              index={index}
            />
          ))}
        </div>

        {filteredMembers.length === 0 && (
          <div className="text-center py-24 glass rounded-[3rem] border-white/5">
            <p className="text-blue-200/40 font-black text-sm uppercase tracking-widest">No builders found... GROWING THE ECOSYSTEM</p>
          </div>
        )}
      </div>

      <Footer />
    </div>
  )
}
