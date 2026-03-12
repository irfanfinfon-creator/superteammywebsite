'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Pencil, Trash2, X, Search } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ImageUpload } from '@/components/ui/image-upload'
import { Member } from '@/types'
import Image from 'next/image'
import { saveMemberAction, deleteMemberAction } from './actions'

interface MembersClientProps {
    initialMembers: Member[]
}

export default function MembersClient({ initialMembers }: MembersClientProps) {
    const [members, setMembers] = useState<Member[]>(initialMembers)
    const [searchQuery, setSearchQuery] = useState('')
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [editingMember, setEditingMember] = useState<Member | null>(null)
    const [formData, setFormData] = useState<Partial<Member>>({
        name: '',
        photo_url: '',
        role: '',
        company: '',
        skills: [],
        twitter_url: '',
        hackathon_wins: 0,
        projects_built: 0,
        grants_received: 0,
        dao_contributions: 0,
        bounties_completed: 0,
        is_featured: false,
        special_badge: []
    })


    // Sync state if initialMembers changes (e.g. on navigation)
    useEffect(() => {
        setMembers(initialMembers)
    }, [initialMembers])


    const filteredMembers = members.filter(member =>
        member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        member.role?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        member.company?.toLowerCase().includes(searchQuery.toLowerCase())
    )

    const handleOpenModal = (member?: Member) => {
        if (member) {
            setEditingMember(member)
            setFormData(member)
        } else {
            setEditingMember(null)
            setFormData({
                name: '',
                photo_url: '',
                role: '',
                company: '',
                skills: [],
                twitter_url: '',
                hackathon_wins: 0,
                projects_built: 0,
                grants_received: 0,
                dao_contributions: 0,
                bounties_completed: 0,
                is_featured: false,
                special_badge: []
            })
        }
        setIsModalOpen(true)
    }

    const handleSave = async () => {
        try {
            if (editingMember) {
                const updatedMember = await saveMemberAction(formData, editingMember.id)
                setMembers(prev => prev.map(m => m.id === editingMember.id ? (updatedMember as Member) : m))
            } else {
                const newMember = await saveMemberAction(formData)
                setMembers(prev => [newMember as Member, ...prev])
            }
            setIsModalOpen(false)
        } catch (err: any) {
            alert('Failed to save member: ' + err.message)
        }
    }

    const handleDelete = async (id: string) => {
        if (confirm('Are you sure you want to delete this member?')) {
            try {
                await deleteMemberAction(id)
                setMembers(prev => prev.filter(m => m.id !== id))
            } catch (err: any) {
                alert('Failed to delete member: ' + err.message)
            }
        }
    }

    return (
        <div>
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-white">Members</h1>
                    <p className="text-gray-400">Manage community members</p>
                </div>
                <Button onClick={() => handleOpenModal()} className="bg-white text-black hover:bg-gray-200">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Member
                </Button>
            </div>

            <div className="mb-6">
                <div className="relative max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <Input
                        placeholder="Search members..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10 bg-#111111 border-[#1a1a1a] text-white placeholder:text-gray-400"
                    />
                </div>
            </div>

            <Card className="bg-[#111111] border-#1a1a1a">
                <CardContent className="p-0">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-[#111111] border-b border-#1a1a1a">
                                <tr>
                                    <th className="text-left px-6 py-4 text-sm font-medium text-gray-300">Member</th>
                                    <th className="text-left px-6 py-4 text-sm font-medium text-gray-300">Role</th>
                                    <th className="text-left px-6 py-4 text-sm font-medium text-gray-300">Company</th>
                                    <th className="text-left px-6 py-4 text-sm font-medium text-gray-300">Skills</th>
                                    <th className="text-left px-6 py-4 text-sm font-medium text-gray-300">Badge</th>
                                    <th className="text-left px-6 py-4 text-sm font-medium text-gray-300">Featured</th>
                                    <th className="text-right px-6 py-4 text-sm font-medium text-gray-300">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-#1a1a1a">
                                {filteredMembers.map((member) => (
                                    <tr key={member.id} className="bg-[#111111] hover:bg-#1a1a1a/50">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <Image
                                                    src={member.photo_url || 'https://via.placeholder.com/40'}
                                                    alt={member.name}
                                                    width={40}
                                                    height={40}
                                                    unoptimized
                                                    className="aspect-square rounded-xs object-cover"
                                                />
                                                <span className="font-medium text-white">{member.name}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-gray-300">{member.role}</td>
                                        <td className="px-6 py-4 text-gray-300">{member.company}</td>
                                        <td className="px-6 py-4">
                                            <div className="flex flex-wrap gap-1">
                                                {member.skills?.slice(0, 3).map((skill) => (
                                                    <Badge key={skill} variant="default">
                                                        {skill}
                                                    </Badge>
                                                ))}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            {Array.isArray(member.special_badge) && member.special_badge.length > 0 ? (
                                                <div className="flex flex-wrap gap-1">
                                                    {member.special_badge.map((badge, idx) => (
                                                        <Badge key={`${badge}-${idx}`} className="bg-yellow-500/20 text-yellow-300">{badge}</Badge>
                                                    ))}
                                                </div>
                                            ) : (
                                                <span className="text-gray-500">-</span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4">
                                            {member.is_featured ? (
                                                <Badge className="bg-purple-500/20 text-purple-300">Featured</Badge>
                                            ) : (
                                                <span className="text-gray-500">-</span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center justify-end gap-2">
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    onClick={() => handleOpenModal(member)}
                                                    className="text-gray-300 hover:text-white hover:bg-#1a1a1a"
                                                >
                                                    <Pencil className="w-4 h-4" />
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    onClick={() => handleDelete(member.id)}
                                                    className="text-red-400 hover:text-red-300 hover:bg-#1a1a1a"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </Button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>

            <AnimatePresence>
                {isModalOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4"
                        onClick={() => setIsModalOpen(false)}
                    >
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.95, opacity: 0 }}
                            className="bg-[#111111] rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto border border-[#1a1a1a]"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="flex items-center justify-between p-6 border-b border-#1a1a1a">
                                <h2 className="text-xl font-bold text-white">
                                    {editingMember ? 'Edit Member' : 'Add New Member'}
                                </h2>
                                <Button variant="ghost" size="icon" onClick={() => setIsModalOpen(false)} className="text-gray-300 hover:text-white">
                                    <X className="w-5 h-5" />
                                </Button>
                            </div>

                            <div className="p-6 space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <Label htmlFor="name" className="text-white">Name</Label>
                                        <Input
                                            id="name" className="bg-[#0a0a0a] border-[#1a1a1a] text-white"
                                            value={formData.name || ''}
                                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                            placeholder="Enter name"
                                        />
                                    </div>
                                    <div>
                                        <Label htmlFor="role" className="text-white">Role</Label>
                                        <Input
                                            id="role" className="bg-[#0a0a0a] border-[#1a1a1a] text-white"
                                            value={formData.role || ''}
                                            onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                                            placeholder="Enter role"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <Label htmlFor="company" className="text-white">Company</Label>
                                        <Input
                                            id="company" className="bg-[#0a0a0a] border-[#1a1a1a] text-white"
                                            value={formData.company || ''}
                                            onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                                            placeholder="Enter company"
                                        />
                                    </div>
                                    <div>
                                        <Label className="text-white">Photo</Label>
                                        <ImageUpload
                                            value={formData.photo_url || ''}
                                            onChange={(url) => setFormData({ ...formData, photo_url: url })}
                                            folder="members"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <Label htmlFor="skills" className="text-white">Skills (comma-separated)</Label>
                                    <Input
                                        id="skills" className="bg-[#0a0a0a] border-[#1a1a1a] text-white"
                                        value={formData.skills?.join(', ') || ''}
                                        onChange={(e) => setFormData({
                                            ...formData,
                                            skills: e.target.value.split(',').map(s => s.trim()).filter(Boolean)
                                        })}
                                        placeholder="Rust, Frontend, Design"
                                    />
                                </div>

                                <div>
                                    <Label htmlFor="special_badge" className="text-white">Special Badges (comma-separated)</Label>
                                    <Input
                                        id="special_badge" className="bg-[#0a0a0a] border-[#1a1a1a] text-white"
                                        value={(formData.special_badge || []).join(', ')}
                                        onChange={(e) => setFormData({
                                            ...formData,
                                            special_badge: e.target.value.split(',').map(s => s.trim()).filter(Boolean) as string[]
                                        })}
                                        placeholder="e.g. Solana Builder, Hackathon Winner"
                                    />
                                </div>

                                <div>
                                    <Label htmlFor="twitter_url" className="text-white">Twitter URL</Label>
                                    <Input
                                        id="twitter_url" className="bg-[#0a0a0a] border-[#1a1a1a] text-white"
                                        value={formData.twitter_url || ''}
                                        onChange={(e) => setFormData({ ...formData, twitter_url: e.target.value })}
                                        placeholder="https://twitter.com/..."
                                    />
                                </div>

                                <div className="grid grid-cols-5 gap-4">
                                    <div>
                                        <Label htmlFor="hackathon_wins" className="text-white">Hackathon Wins</Label>
                                        <Input
                                            id="hackathon_wins" className="bg-[#0a0a0a] border-[#1a1a1a] text-white"
                                            type="number"
                                            value={formData.hackathon_wins || 0}
                                            onChange={(e) => setFormData({ ...formData, hackathon_wins: parseInt(e.target.value) || 0 })}
                                        />
                                    </div>
                                    <div>
                                        <Label htmlFor="projects_built" className="text-white">Projects Built</Label>
                                        <Input
                                            id="projects_built" className="bg-[#0a0a0a] border-[#1a1a1a] text-white"
                                            type="number"
                                            value={formData.projects_built || 0}
                                            onChange={(e) => setFormData({ ...formData, projects_built: parseInt(e.target.value) || 0 })}
                                        />
                                    </div>
                                    <div>
                                        <Label htmlFor="grants_received" className="text-white">Grants ($)</Label>
                                        <Input
                                            id="grants_received" className="bg-[#0a0a0a] border-[#1a1a1a] text-white"
                                            type="number"
                                            value={formData.grants_received || 0}
                                            onChange={(e) => setFormData({ ...formData, grants_received: parseInt(e.target.value) || 0 })}
                                        />
                                    </div>
                                    <div>
                                        <Label htmlFor="dao_contributions" className="text-white text-sm">DAO Contributions</Label>
                                        <Input
                                            id="dao_contributions" className="bg-[#0a0a0a] border-[#1a1a1a] text-white"
                                            type="number"
                                            value={formData.dao_contributions || 0}
                                            onChange={(e) => setFormData({ ...formData, dao_contributions: parseInt(e.target.value) || 0 })}
                                        />
                                    </div>
                                    <div>
                                        <Label htmlFor="bounties_completed" className="text-white">Bounties Completed</Label>
                                        <Input
                                            id="bounties_completed" className="bg-[#0a0a0a] border-[#1a1a1a] text-white"
                                            type="number"
                                            value={formData.bounties_completed || 0}
                                            onChange={(e) => setFormData({ ...formData, bounties_completed: parseInt(e.target.value) || 0 })}
                                        />
                                    </div>
                                </div>

                                <div className="flex items-center gap-2">
                                    <input
                                        type="checkbox"
                                        id="is_featured"
                                        checked={formData.is_featured || false}
                                        onChange={(e) => setFormData({ ...formData, is_featured: e.target.checked })}
                                        className="w-4 h-4 rounded border-#333333 bg-#0a0a0a text-white"
                                    />
                                    <Label htmlFor="is_featured" className="font-normal text-white">
                                        Featured on landing page
                                    </Label>
                                </div>
                            </div>

                            <div className="flex items-center justify-end gap-4 p-6 border-t border-[#1a1a1a]">
                                <Button variant="outline" className="text-white border-[#333333] hover:bg-[#1a1a1a]" onClick={() => setIsModalOpen(false)}>
                                    Cancel
                                </Button>
                                <Button onClick={handleSave} className="bg-white text-black hover:bg-gray-200">
                                    {editingMember ? 'Save Changes' : 'Add Member'}
                                </Button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}
