'use client'

import { motion } from 'framer-motion'
import { Badge } from '@/components/ui/badge'
import { Member } from '@/types'
import { cn } from '@/lib/utils'
import Image from 'next/image'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXTwitter } from "@fortawesome/free-brands-svg-icons";

interface MemberCardProps {
    member: Member
    isFlipped: boolean
    onToggleFlip: (id: string) => void
    index?: number
}

export function MemberCard({ member, isFlipped, onToggleFlip, index = 0 }: MemberCardProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.05 }}
            className="flip-card cursor-pointer group"
            onClick={() => onToggleFlip(member.id)}
        >

            <div className="aspect-3/6 w-full">
                <div className={cn("flip-card-inner", isFlipped && "flipped")}>
                    {/* FRONT FACE */}
                    <div className="flip-card-front flex flex-col border border-white rounded-[2.5rem] p-2 bg-black/40 backdrop-blur-sm">
                        <div className="aspect-3/4 rounded-t-4xl bg-white/5 overflow-hidden mb-2 border border-white/5 relative">
                            <Image
                                src={member.photo_url || 'https://via.placeholder.com/300x400'}
                                alt={member.name}
                                fill
                                unoptimized
                                className="object-cover group-hover:scale-105 transition-all duration-500"
                            />
                        </div>
                        <div className="px-2 pb-4">
                            <div className="flex items-start gap-3 mb-2">
                                <div className="flex-1 min-w-0">
                                    <h3 className="text-2xl font-bold text-white tracking-tight truncate">
                                        {member.name}
                                    </h3>
                                    <p className="text-[10px] text-white font-black uppercase tracking-widest truncate">
                                        {member.company}
                                    </p>
                                    <div className="text-[10px] text-blue-400 font-black uppercase tracking-widest truncate">
                                        {member.role}
                                    </div>
                                </div>
                                {member.twitter_url && (
                                    <a
                                        href={member.twitter_url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        onClick={(e) => e.stopPropagation()}
                                        className="text-2xl hover:scale-110 transition-transform inline-block text-white/70 hover:text-white mt-1"
                                    >
                                        <FontAwesomeIcon icon={faXTwitter} />
                                    </a>
                                )}

                            </div>
                            <div className="py-2 flex gap-2">
                                {Array.isArray(member.special_badge) && member.special_badge.map((badge, idx) => (
                                    <Badge
                                        key={`${badge}-${idx}`}
                                        variant="outline"
                                        className="text-[10px] px-2 py-0.5 border-[#1E2D5E] text-black bg-yellow-500 hover:scale-110 transition-transform"
                                    >
                                        {badge}
                                    </Badge>
                                ))}
                            </div>
                            {member.skills && member.skills.length > 0 && (
                                <div className="flex flex-wrap gap-1.5 mb-6 ">
                                    {member.skills.slice(0, 4).map((skill) => (
                                        <Badge
                                            key={skill}
                                            variant="default"
                                            className="text-[10px] px-2 py-0.5 text-white bg-[#6560FF] hover:scale-110 transition-transform"
                                        >
                                            {skill}
                                        </Badge>
                                    ))}
                                </div>
                            )}

                        </div>
                        <div className="absolute bottom-6 right-6 text-[10px] text-white/30 uppercase tracking-widest">
                            Tap card to flip
                        </div>
                    </div>

                    {/* BACK FACE */}
                    <div className="flip-card-back flex flex-col border border-white rounded-[2.5rem] p-6 overflow-hidden bg-black/60 backdrop-blur-xl">
                        <div>
                            <h3 className="text-2xl font-bold text-white mb-1 tracking-tight truncate">
                                {member.name}
                            </h3>
                            <p className="text-[10px] text-blue-500 font-black uppercase tracking-widest mb-4 truncate">
                                {member.role}
                            </p>
                        </div>

                        {/* Stats */}
                        <h3 className="text-[14px] font-black text-white uppercase tracking-wider pt-2">Member Stats</h3>
                        <div className="aspect-square grid grid-cols-2 grid-rows-2 gap-2 mt-4 items-center">
                            {member.hackathon_wins > 0 && (
                                <div className="text-start p-3 bg-blue-500 rounded-lg hover:scale-105 transition-transform">
                                    <div className="text-[10px] text-white uppercase tracking-wider pb-2">Hackathon <br /> Wins</div>
                                    <div className="text-2xl font-black text-white leading-none">{member.hackathon_wins}</div>
                                </div>
                            )}
                            {member.projects_built > 0 && (
                                <div className="text-start p-3 bg-blue-500 rounded-lg hover:scale-105 transition-transform">
                                    <div className="text-[10px] text-white uppercase tracking-wider pb-2">Projects <br /> Built</div>
                                    <div className="text-2xl font-black text-white leading-none">{member.projects_built}</div>
                                </div>
                            )}
                            {member.bounties_completed > 0 && (
                                <div className="text-start p-3 bg-blue-500 rounded-lg hover:scale-105 transition-transform">
                                    <div className="text-[10px] text-white uppercase tracking-wider pb-2">Bounties Cleared</div>
                                    <div className="text-2xl font-black text-white leading-none">{member.bounties_completed}</div>
                                </div>
                            )}
                            {member.dao_contributions > 0 && (
                                <div className="text-start p-3 bg-blue-500 rounded-lg hover:scale-105 transition-transform">
                                    <div className="text-[10px] text-white uppercase tracking-wider pb-2">DAO <br />Contribution</div>
                                    <div className="text-2xl font-black text-white leading-none">{member.dao_contributions}</div>
                                </div>
                            )}
                            {member.grants_received > 0 && (
                                <div className="text-start p-3 bg-blue-500 rounded-lg hover:scale-105 transition-transform">
                                    <div className="text-[10px] text-white uppercase tracking-wider pb-2">Grants Received</div>
                                    <div className="text-l font-black text-white leading-none"><span>$</span>{member.grants_received}</div>
                                </div>
                            )}
                        </div>

                        {/* Twitter link */}
                        {member.twitter_url && (
                            <a
                                href={member.twitter_url || ""}
                                target="_blank"
                                rel="noopener noreferrer"
                                onClick={(e) => e.stopPropagation()}
                                className="absolute bottom-6 left-6 text-2xl hover:scale-105 transition-transform inline-block text-white/70 hover:text-white"
                            >
                                <FontAwesomeIcon icon={faXTwitter} />
                            </a>
                        )}
                    </div>
                </div>
            </div>
        </motion.div>
    )
}
