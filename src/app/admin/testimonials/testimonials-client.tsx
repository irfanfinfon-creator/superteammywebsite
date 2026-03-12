'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Pencil, Trash2, X, Search, ExternalLink } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Label } from '@/components/ui/label'
import { Testimonial } from '@/types'
import { saveTestimonialAction, deleteTestimonialAction } from './actions'

interface TestimonialsClientProps {
    initialTestimonials: Testimonial[]
}

export default function TestimonialsClient({ initialTestimonials }: TestimonialsClientProps) {
    const [testimonials, setTestimonials] = useState<Testimonial[]>(initialTestimonials)
    const [searchQuery, setSearchQuery] = useState('')
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [editingTestimonial, setEditingTestimonial] = useState<Testimonial | null>(null)
    const [formData, setFormData] = useState<Partial<Testimonial>>({
        tweet_url: '',
        is_featured: false,
    })


    useEffect(() => {
        setTestimonials(initialTestimonials)
    }, [initialTestimonials])


    const filteredTestimonials = testimonials.filter((t) =>
        t.tweet_url.toLowerCase().includes(searchQuery.toLowerCase()),
    )

    const handleOpenModal = (testimonial?: Testimonial) => {
        if (testimonial) {
            setEditingTestimonial(testimonial)
            setFormData({
                tweet_url: testimonial.tweet_url,
                is_featured: testimonial.is_featured,
            })
        } else {
            setEditingTestimonial(null)
            setFormData({
                tweet_url: '',
                is_featured: false,
            })
        }
        setIsModalOpen(true)
    }

    const handleSave = async () => {
        if (!formData.tweet_url) {
            alert('Tweet URL is required.')
            return
        }

        const payload = {
            tweet_url: formData.tweet_url,
            is_featured: formData.is_featured ?? false,
        }

        try {
            if (editingTestimonial) {
                const updated = await saveTestimonialAction(payload, editingTestimonial.id)
                setTestimonials(prev => prev.map(t => t.id === editingTestimonial.id ? (updated as Testimonial) : t))
            } else {
                const created = await saveTestimonialAction(payload)
                setTestimonials(prev => [created as Testimonial, ...prev])
            }
            setIsModalOpen(false)
        } catch (err: any) {
            alert('Failed to save testimonial: ' + err.message)
        }
    }

    const handleDelete = async (id: string) => {
        if (confirm('Are you sure you want to delete this testimonial?')) {
            try {
                await deleteTestimonialAction(id)
                setTestimonials(prev => prev.filter(t => t.id !== id))
            } catch (err: any) {
                alert('Failed to delete testimonial: ' + err.message)
            }
        }
    }

    return (
        <div>
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-white">Testimonials</h1>
                    <p className="text-gray-400">Manage tweet-based testimonials for the Wall of Love</p>
                </div>
                <Button onClick={() => handleOpenModal()} className="bg-white text-black hover:bg-gray-200">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Testimonial
                </Button>
            </div>

            <div className="mb-6">
                <div className="relative max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <Input
                        placeholder="Search testimonials..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10 bg-#111111 border-#1a1a1a text-white placeholder:text-gray-400"
                    />
                </div>
            </div>

            <Card className="bg-#111111 border-#1a1a1a">
                <CardContent className="p-0">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-[#111111] border-b border-#1a1a1a">
                                <tr>
                                    <th className="text-left px-6 py-4 text-sm font-medium text-gray-300">Tweet URL</th>
                                    <th className="text-left px-6 py-4 text-sm font-medium text-gray-300">Featured</th>
                                    <th className="text-left px-6 py-4 text-sm font-medium text-gray-300">Created</th>
                                    <th className="text-right px-6 py-4 text-sm font-medium text-gray-300">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-#1a1a1a bg-[#111111]">
                                {filteredTestimonials.map((testimonial) => (
                                    <tr key={testimonial.id} className="hover:bg-#1a1a1a/50">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2 max-w-md">
                                                <a
                                                    href={testimonial.tweet_url}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-sm text-blue-400 hover:underline truncate"
                                                >
                                                    {testimonial.tweet_url}
                                                </a>
                                                <ExternalLink className="w-4 h-4 text-gray-400" />
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <Badge className={testimonial.is_featured ? 'bg-purple-500/20 text-purple-300' : 'bg-#1a1a1a text-gray-300'}>
                                                {testimonial.is_featured ? 'Featured' : 'Normal'}
                                            </Badge>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-400">
                                            {testimonial.created_at
                                                ? new Date(testimonial.created_at).toLocaleDateString('en-MY', {
                                                    year: 'numeric',
                                                    month: 'short',
                                                    day: 'numeric',
                                                })
                                                : '-'}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center justify-end gap-2">
                                                <Button variant="ghost" size="icon" onClick={() => handleOpenModal(testimonial)} className="text-gray-300 hover:text-white hover:bg-#1a1a1a">
                                                    <Pencil className="w-4 h-4" />
                                                </Button>
                                                <Button variant="ghost" size="icon" onClick={() => handleDelete(testimonial.id)} className="text-red-400 hover:text-red-300 hover:bg-#1a1a1a">
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
                                <h2 className="text-xl font-bold text-white">{editingTestimonial ? 'Edit Testimonial' : 'Add New Testimonial'}</h2>
                                <Button variant="ghost" size="icon" onClick={() => setIsModalOpen(false)} className="text-gray-300 hover:text-white">
                                    <X className="w-5 h-5" />
                                </Button>
                            </div>

                            <div className="p-6 space-y-6">
                                <div className="space-y-2">
                                    <Label htmlFor="tweet_url" className="text-white">
                                        Tweet URL
                                    </Label>
                                    <Input
                                        id="tweet_url"
                                        value={formData.tweet_url || ''}
                                        onChange={(e) => setFormData({ ...formData, tweet_url: e.target.value })}
                                        placeholder="https://x.com/username/status/1234567890"
                                        className="bg-#0a0a0a border-#1a1a1a text-white"
                                    />
                                    <p className="text-xs text-gray-400">
                                        Paste the full X/Twitter status URL. The public site will embed the tweet on the Wall of Love.
                                    </p>
                                </div>

                                <div className="flex items-center gap-2">
                                    <input
                                        type="checkbox"
                                        id="is_featured"
                                        checked={formData.is_featured || false}
                                        onChange={(e) => setFormData({ ...formData, is_featured: e.target.checked })}
                                        className="w-4 h-4 rounded border-#333333 bg-#0a0a0a"
                                    />
                                    <Label htmlFor="is_featured" className="font-normal text-white">
                                        Featured testimonial
                                    </Label>
                                </div>
                            </div>

                            <div className="flex items-center justify-end gap-4 p-6 border-t border-#1a1a1a">
                                <Button variant="outline" className="text-white border-#333333 hover:bg-#1a1a1a" onClick={() => setIsModalOpen(false)}>Cancel</Button>
                                <Button onClick={handleSave} className="bg-white text-black hover:bg-gray-200">{editingTestimonial ? 'Save Changes' : 'Add Testimonial'}</Button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}
