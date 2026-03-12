'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Pencil, Trash2, X, Search, Send } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Announcement } from '@/types'
import { saveAnnouncementAction, deleteAnnouncementAction, publishAnnouncementAction } from './actions'

interface AnnouncementsClientProps {
    initialAnnouncements: Announcement[]
}

export default function AnnouncementsClient({ initialAnnouncements }: AnnouncementsClientProps) {
    const [announcements, setAnnouncements] = useState<Announcement[]>(initialAnnouncements)
    const [searchQuery, setSearchQuery] = useState('')
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [editingAnnouncement, setEditingAnnouncement] = useState<Announcement | null>(null)
    const [formData, setFormData] = useState<Partial<Announcement>>({
        title: '',
        content: '',
        is_published: false,
        published_at: ''
    })


    useEffect(() => {
        setAnnouncements(initialAnnouncements)
    }, [initialAnnouncements])


    const filteredAnnouncements = announcements.filter(a =>
        a.title?.toLowerCase().includes(searchQuery.toLowerCase())
    )

    const handleOpenModal = (announcement?: Announcement) => {
        if (announcement) {
            setEditingAnnouncement(announcement)
            setFormData({
                ...announcement,
                published_at: announcement.published_at ? new Date(announcement.published_at).toISOString().slice(0, 16) : ''
            })
        } else {
            setEditingAnnouncement(null)
            setFormData({ title: '', content: '', image_url: '', is_published: false, published_at: '' })
        }
        setIsModalOpen(true)
    }

    const handleSave = async () => {
        const dataToSave = {
            ...formData,
            published_at: formData.is_published && formData.published_at
                ? new Date(formData.published_at as string).toISOString()
                : formData.is_published ? new Date().toISOString() : null
        }

        try {
            if (editingAnnouncement) {
                const updated = await saveAnnouncementAction(dataToSave, editingAnnouncement.id)
                setAnnouncements(prev => prev.map(a => a.id === editingAnnouncement.id ? (updated as Announcement) : a))
            } else {
                const created = await saveAnnouncementAction(dataToSave)
                setAnnouncements(prev => [created as Announcement, ...prev])
            }
            setIsModalOpen(false)
        } catch (err: any) {
            alert('Failed to save announcement: ' + err.message)
        }
    }

    const handleDelete = async (id: string) => {
        if (confirm('Are you sure you want to delete this announcement?')) {
            try {
                await deleteAnnouncementAction(id)
                setAnnouncements(prev => prev.filter(a => a.id !== id))
            } catch (err: any) {
                alert('Failed to delete announcement: ' + err.message)
            }
        }
    }

    const handlePublish = async (id: string) => {
        try {
            const updated = await publishAnnouncementAction(id)
            setAnnouncements(prev => prev.map(a => a.id === id ? (updated as Announcement) : a))
        } catch (err: any) {
            alert('Failed to publish announcement: ' + err.message)
        }
    }

    return (
        <div>
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-white">Announcements</h1>
                    <p className="text-gray-400">Manage community announcements</p>
                </div>
                <Button onClick={() => handleOpenModal()} className="bg-white text-black hover:bg-gray-200">
                    <Plus className="w-4 h-4 mr-2" />
                    New Announcement
                </Button>
            </div>

            <div className="mb-6">
                <div className="relative max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <Input
                        placeholder="Search announcements..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10 bg-[#111111] border-#1a1a1a text-white placeholder:text-gray-400"
                    />
                </div>
            </div>

            <Card className="bg-[#111111] border-#1a1a1a">
                <CardContent className="p-0">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-[#111111] border-b border-#1a1a1a">
                                <tr>
                                    <th className="text-left px-6 py-4 text-sm font-medium text-gray-300">Title</th>
                                    <th className="text-left px-6 py-4 text-sm font-medium text-gray-300">Preview</th>
                                    <th className="text-left px-6 py-4 text-sm font-medium text-gray-300">Status</th>
                                    <th className="text-left px-6 py-4 text-sm font-medium text-gray-300">Date</th>
                                    <th className="text-right px-6 py-4 text-sm font-medium text-gray-300">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-#1a1a1a">
                                {filteredAnnouncements.map((announcement) => (
                                    <tr key={announcement.id} className="hover:bg-#1a1a1a/50">
                                        <td className="px-6 py-4">
                                            <span className="font-medium text-white">{announcement.title}</span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <p className="text-sm text-gray-400 max-w-xs truncate">{announcement.content}</p>
                                        </td>
                                        <td className="px-6 py-4">
                                            <Badge className={announcement.is_published ? 'bg-green-500/20 text-green-300' : 'bg-yellow-500/20 text-yellow-300'}>
                                                {announcement.is_published ? 'Published' : 'Draft'}
                                            </Badge>
                                        </td>
                                        <td className="px-6 py-4 text-gray-400 text-sm">
                                            {announcement.published_at
                                                ? new Date(announcement.published_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
                                                : '-'}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center justify-end gap-2">
                                                {!announcement.is_published && (
                                                    <Button variant="ghost" size="icon" onClick={() => handlePublish(announcement.id)} className="text-green-400 hover:text-green-300 hover:bg-#1a1a1a" title="Publish">
                                                        <Send className="w-4 h-4" />
                                                    </Button>
                                                )}
                                                <Button variant="ghost" size="icon" onClick={() => handleOpenModal(announcement)} className="text-gray-300 hover:text-white hover:bg-#1a1a1a">
                                                    <Pencil className="w-4 h-4" />
                                                </Button>
                                                <Button variant="ghost" size="icon" onClick={() => handleDelete(announcement.id)} className="text-red-400 hover:text-red-300 hover:bg-#1a1a1a">
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
                            className="bg-[#111111] rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto border border-#1a1a1a"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="flex items-center justify-between p-6 border-b border-#1a1a1a">
                                <h2 className="text-xl font-bold text-white">{editingAnnouncement ? 'Edit Announcement' : 'New Announcement'}</h2>
                                <Button variant="ghost" size="icon" onClick={() => setIsModalOpen(false)} className="text-gray-300 hover:text-white">
                                    <X className="w-5 h-5" />
                                </Button>
                            </div>

                            <div className="p-6 space-y-4">
                                <div>
                                    <Label htmlFor="title" className="text-white">Title</Label>
                                    <Input
                                        id="title"
                                        value={formData.title || ''}
                                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                        placeholder="Announcement title"
                                        className="bg-#0a0a0a border-#1a1a1a text-white"
                                    />
                                </div>

                                <div>
                                    <Label htmlFor="content" className="text-white">Content</Label>
                                    <Textarea
                                        id="content"
                                        value={formData.content || ''}
                                        onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                                        placeholder="Write your announcement..."
                                        rows={6}
                                        className="bg-#0a0a0a border-#1a1a1a text-white"
                                    />
                                </div>

                                <div className="flex items-center gap-2">
                                    <input
                                        type="checkbox"
                                        id="is_published"
                                        checked={formData.is_published || false}
                                        onChange={(e) => setFormData({ ...formData, is_published: e.target.checked })}
                                        className="w-4 h-4 rounded border-#333333 bg-#0a0a0a"
                                    />
                                    <Label htmlFor="is_published" className="font-normal text-white">
                                        Publish immediately
                                    </Label>
                                </div>
                            </div>

                            <div className="flex items-center justify-end gap-4 p-6 border-t border-#1a1a1a">
                                <Button variant="outline" className="text-white border-#333333 hover:bg-#1a1a1a" onClick={() => setIsModalOpen(false)}>Cancel</Button>
                                <Button onClick={handleSave} className="bg-white text-black hover:bg-gray-200">{editingAnnouncement ? 'Save Changes' : 'Create'}</Button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}
