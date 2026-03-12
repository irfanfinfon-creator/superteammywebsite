'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Trash2, X, Link2, Loader2, Calendar, MapPin, ExternalLink, Pencil } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ImageUpload } from '@/components/ui/image-upload'
import { Event } from '@/types'
import Image from 'next/image'
import { saveEventAction, deleteEventAction, toggleEventUpcomingAction } from './actions'

interface EventsClientProps {
    initialEvents: Event[]
}

export default function EventsClient({ initialEvents }: EventsClientProps) {
    const [events, setEvents] = useState<Event[]>(initialEvents)
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [lumaUrl, setLumaUrl] = useState('')
    const [isFetching, setIsFetching] = useState(false)
    const [fetchError, setFetchError] = useState('')
    const [isSaving, setIsSaving] = useState(false)
    const [formData, setFormData] = useState<Partial<Event>>({})
    const [fetchSuccess, setFetchSuccess] = useState(false)
    const [saveError, setSaveError] = useState('')
    const [editingEvent, setEditingEvent] = useState<Event | null>(null)

    useEffect(() => {
        setEvents(initialEvents)
    }, [initialEvents])

    const fetchFromLuma = async () => {
        if (!lumaUrl.trim()) return
        setIsFetching(true)
        setFetchError('')
        setFetchSuccess(false)
        setFormData({})

        try {
            const res = await fetch('/api/fetch-event', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ url: lumaUrl.trim() }),
            })
            const data = await res.json()

            if (!res.ok || data.error) {
                setFetchError(data.error || 'Failed to fetch event details.')
            } else {
                // Safely decode any HTML entities (&amp;, &#39;, etc.)
                const decodeHtml = (html: string | null | undefined) => {
                    if (!html) return ''
                    try {
                        const txt = document.createElement('textarea')
                        txt.innerHTML = html
                        return txt.value
                    } catch {
                        return html
                    }
                }

                setFormData({
                    title: decodeHtml(data.title),
                    description: decodeHtml(data.description),
                    image_url: data.image_url,
                    date: data.date ? data.date.slice(0, 16) : '',
                    location: data.location,
                    luma_url: data.luma_url,
                    is_upcoming: true,
                })
                setFetchSuccess(true)
            }
        } catch {
            setFetchError('Network error. Please try again.')
        } finally {
            setIsFetching(false)
        }
    }

    const handleEdit = (event: Event) => {
        setEditingEvent(event)

        // Format DB timestamp to local datetime-local string format (YYYY-MM-DDThh:mm)
        let localDateStr = ''
        if (event.date) {
            const d = new Date(event.date)
            const pad = (n: number) => n.toString().padStart(2, '0')
            localDateStr = `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`
        }

        setFormData({
            title: event.title,
            description: event.description,
            date: localDateStr,
            location: event.location,
            image_url: event.image_url,
            luma_url: event.luma_url,
            is_upcoming: event.is_upcoming,
        })
        setLumaUrl(event.luma_url || '')
        setFetchSuccess(true)
        setIsModalOpen(true)
    }

    const handleSave = async () => {
        if (!formData.title || !formData.luma_url) return
        setIsSaving(true)
        setSaveError('')

        try {
            // Sanitize date: convert datetime-local ("2025-03-10T14:00") to ISO string
            let dateValue: string | null = null
            if (formData.date) {
                const parsed = new Date(formData.date)
                dateValue = isNaN(parsed.getTime()) ? null : parsed.toISOString()
            }

            const payload = {
                title: formData.title,
                description: formData.description || null,
                date: dateValue,
                location: formData.location || null,
                image_url: formData.image_url || null,
                luma_url: formData.luma_url,
                is_upcoming: formData.is_upcoming ?? true,
            }

            if (editingEvent) {
                try {
                    const data = await saveEventAction(payload, editingEvent.id)
                    setEvents(prev => prev.map(e => e.id === editingEvent.id ? (data as Event) : e))
                    closeModal()
                } catch (err: any) {
                    setSaveError(err.message || 'Failed to update event.')
                }
            } else {
                try {
                    const data = await saveEventAction(payload)
                    setEvents(prev => [data as Event, ...prev])
                    closeModal()
                } catch (err: any) {
                    setSaveError(err.message || 'Failed to save event. Check your permissions.')
                }
            }
        } catch (err: unknown) {
            console.error('Event save error:', err)
            const message = err instanceof Error ? err.message : 'An unexpected client error occurred.'
            setSaveError(message)
        } finally {
            setIsSaving(false)
        }
    }

    const handleDelete = async (id: string) => {
        if (!confirm('Remove this event?')) return
        try {
            await deleteEventAction(id)
            setEvents(prev => prev.filter(e => e.id !== id))
        } catch (err: any) {
            alert('Failed to delete event: ' + err.message)
        }
    }

    const handleToggleUpcoming = async (event: Event) => {
        try {
            const updated = await toggleEventUpcomingAction(event.id, !event.is_upcoming)
            setEvents(prev => prev.map(e => e.id === event.id ? (updated as Event) : e))
        } catch (err: any) {
            alert('Failed to toggle event status: ' + err.message)
        }
    }

    const closeModal = () => {
        setIsModalOpen(false)
        setEditingEvent(null)
        setLumaUrl('')
        setFormData({})
        setFetchError('')
        setFetchSuccess(false)
        setSaveError('')
    }

    const formatDate = (dateStr: string | null) => {
        if (!dateStr) return 'Date TBD'
        return new Date(dateStr).toLocaleDateString('en-MY', {
            weekday: 'short', day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit'
        })
    }

    const upcomingEvents = events.filter(e => e.is_upcoming)
    const pastEvents = events.filter(e => !e.is_upcoming)

    return (
        <div>
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-white">Events</h1>
                    <p className="text-gray-400 mt-1">Paste a Luma event URL to add it automatically</p>
                </div>
                <Button onClick={() => setIsModalOpen(true)} className="bg-white text-black hover:bg-gray-200 gap-2">
                    <Plus className="w-4 h-4" /> Add Event
                </Button>
            </div>

            {/* Upcoming Events */}
            <div className="mb-10">
                <h2 className="text-lg font-semibold text-white mb-4">Upcoming ({upcomingEvents.length})</h2>
                {upcomingEvents.length === 0 ? (
                    <div className="border-2 border-dashed border-#1a1a1a rounded-xl p-12 text-center text-gray-400">
                        No upcoming events. Add one by pasting a Luma URL.
                    </div>
                ) : (
                    <div className="space-y-4 bg-[#111111]">
                        {upcomingEvents.map(event => (
                            <EventCard
                                key={event.id}
                                event={event}
                                onEdit={handleEdit}
                                onDelete={handleDelete}
                                onToggle={handleToggleUpcoming}
                                formatDate={formatDate}
                            />
                        ))}
                    </div>
                )}
            </div>

            {/* Past Events */}
            {pastEvents.length > 0 && (
                <div>
                    <h2 className="text-lg font-semibold text-white mb-4">Past / Hidden ({pastEvents.length})</h2>
                    <div className="space-y-4">
                        {pastEvents.map(event => (
                            <EventCard
                                key={event.id}
                                event={event}
                                onEdit={handleEdit}
                                onDelete={handleDelete}
                                onToggle={handleToggleUpcoming}
                                formatDate={formatDate}
                            />
                        ))}
                    </div>
                </div>
            )}

            {/* Add Event Modal */}
            <AnimatePresence>
                {isModalOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4"
                        onClick={closeModal}
                    >
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.95, opacity: 0 }}
                            className="bg-[#111111] rounded-2xl shadow-2xl max-w-4xl overflow-hidden border border-#1a1a1a"
                            onClick={e => e.stopPropagation()}
                        >
                            {/* Modal Header */}
                            <div className="flex items-center justify-between p-6 border-b border-#1a1a1a">
                                <h2 className="text-xl font-bold text-white">
                                    {editingEvent ? 'Edit Event' : 'Add Event from Luma'}
                                </h2>
                                <Button variant="ghost" size="icon" onClick={closeModal} className="text-gray-300 hover:text-white">
                                    <X className="w-5 h-5" />
                                </Button>
                            </div>

                            <div className="p-6 space-y-5">
                                {/* URL Input + Fetch */}
                                <div>
                                    <Label className="text-white mb-2 block">Luma Event URL</Label>
                                    <div className="flex gap-2">
                                        <Input
                                            placeholder="https://lu.ma/your-event"
                                            value={lumaUrl}
                                            onChange={e => setLumaUrl(e.target.value)}
                                            onKeyDown={e => e.key === 'Enter' && fetchFromLuma()}
                                            className="text-white bg-#0a0a0a border-#1a1a1a flex-1"
                                        />
                                        <Button
                                            onClick={fetchFromLuma}
                                            disabled={isFetching || !lumaUrl.trim()}
                                            className="bg-white text-black hover:bg-gray-200 gap-2 shrink-0"
                                        >
                                            {isFetching ? <Loader2 className="w-4 h-4 animate-spin" /> : <Link2 className="w-4 h-4" />}
                                            {isFetching ? 'Fetching...' : 'Fetch'}
                                        </Button>
                                    </div>
                                    {fetchError && <p className="text-red-400 text-sm mt-2">{fetchError}</p>}
                                </div>

                                {/* Preview after fetch */}
                                <div className="grid grid-cols-2 gap-5">
                                    {fetchSuccess && formData.title && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            className="border border-green-500/30 bg-green-500/10 rounded-xl overflow-hidden"
                                        >
                                            {formData.image_url && (
                                                <Image src={formData.image_url} alt={formData.title || ''} width={640} height={160} unoptimized className="object-cover w-full h-40" />
                                            )}
                                            <div className="p-4 space-y-1">
                                                <p className="font-semibold text-white">{formData.title}</p>
                                                {formData.date && (
                                                    <p className="text-sm text-gray-300 flex items-center gap-1">
                                                        <Calendar className="w-3 h-3" /> {formatDate(formData.date)}
                                                    </p>
                                                )}
                                                {formData.location && (
                                                    <p className="text-sm text-gray-300 flex items-center gap-1">
                                                        <MapPin className="w-3 h-3" /> {formData.location}
                                                    </p>
                                                )}
                                                {formData.description && (
                                                    <p className="text-sm text-gray-400 mt-2 line-clamp-2">{formData.description}</p>
                                                )}
                                                <p className="text-xs text-green-400 font-medium mt-2">✓ Details fetched successfully</p>
                                            </div>
                                        </motion.div>

                                    )}

                                    {/* Manual override fields (shown after fetch) */}
                                    {fetchSuccess && (
                                        <div className="space-y-3">
                                            <div>
                                                <Label className="text-white mb-1 block text-sm">Title</Label>
                                                <Input
                                                    value={formData.title || ''}
                                                    onChange={e => setFormData({ ...formData, title: e.target.value })}
                                                    className="bg-#0a0a0a border-#1a1a1a text-white"
                                                />
                                            </div>
                                            <div>
                                                <Label className="text-white mb-1 block text-sm">Date & Time</Label>
                                                <Input
                                                    type="datetime-local"
                                                    value={formData.date || ''}
                                                    onChange={e => setFormData({ ...formData, date: e.target.value })}
                                                    className="bg-#0a0a0a border-#1a1a1a text-white"
                                                />
                                            </div>
                                            <div>
                                                <Label className="text-white mb-1 block text-sm">Location</Label>
                                                <Input
                                                    value={formData.location || ''}
                                                    onChange={e => setFormData({ ...formData, location: e.target.value })}
                                                    className="bg-#0a0a0a border-#1a1a1a text-white"
                                                />
                                            </div>
                                            <div>
                                                <Label className="text-white mb-1 block text-sm">Cover Image</Label>
                                                <ImageUpload
                                                    value={formData.image_url || ''}
                                                    onChange={url => setFormData({ ...formData, image_url: url })}
                                                />
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Modal Footer */}
                            <div className="flex flex-col gap-2 p-6 border-t border-#1a1a1a bg-#0a0a0a">
                                {saveError && (
                                    <p className="text-red-400 text-sm text-center">{saveError}</p>
                                )}
                                <div className="flex justify-end gap-3">
                                    <Button variant="outline" onClick={closeModal} className="text-white border-#333333 hover:bg-#1a1a1a">Cancel</Button>
                                    <Button
                                        onClick={handleSave}
                                        disabled={!fetchSuccess || !formData.title || isSaving}
                                        className="bg-white text-black hover:bg-gray-200"
                                    >
                                        {isSaving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                                        {isSaving ? 'Saving...' : 'Save Event'}
                                    </Button>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}

function EventCard({
    event,
    onEdit,
    onDelete,
    onToggle,
    formatDate,
}: {
    event: Event
    onEdit: (event: Event) => void
    onDelete: (id: string) => void
    onToggle: (event: Event) => void
    formatDate: (d: string | null) => string
}) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex gap-4 bg-#111111 border border-#1a1a1a rounded-xl p-4 items-start hover:border-#333333 transition-colors"
        >
            {event.image_url && (
                <Image
                    src={event.image_url}
                    alt={event.title}
                    width={112}
                    height={80}
                    unoptimized
                    className="object-cover rounded-lg shrink-0"
                />
            )}
            <div className="flex-1 min-w-0">
                <p className="font-semibold text-white truncate">{event.title}</p>
                {event.date && (
                    <p className="text-sm text-gray-400 flex items-center gap-1 mt-1">
                        <Calendar className="w-3 h-3" /> {formatDate(event.date)}
                    </p>
                )}
                {event.location && (
                    <p className="text-sm text-gray-400 flex items-center gap-1">
                        <MapPin className="w-3 h-3" /> {event.location}
                    </p>
                )}
                {event.description && (
                    <p className="text-xs text-gray-500 mt-1 line-clamp-1">{event.description}</p>
                )}
            </div>
            <div className="flex flex-col gap-2 shrink-0">
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onEdit(event)}
                    className="gap-1 text-xs border-#333333 text-white hover:bg-#1a1a1a"
                >
                    <Pencil className="w-3 h-3" /> Edit
                </Button>
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onToggle(event)}
                    className={event.is_upcoming ? 'text-green-400 border-green-500/30 hover:bg-green-500/10' : 'text-gray-500'}
                >
                    {event.is_upcoming ? '● Upcoming' : '○ Hidden'}
                </Button>
                {event.luma_url && (
                    <a href={event.luma_url} target="_blank" rel="noopener noreferrer">
                        <Button variant="outline" size="sm" className="w-full gap-1 text-xs border-#333333 text-white hover:bg-#1a1a1a">
                            <ExternalLink className="w-3 h-3" /> Luma
                        </Button>
                    </a>
                )}
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onDelete(event.id)}
                    className="text-red-400 border-red-500/30 hover:bg-red-500/10"
                >
                    <Trash2 className="w-3 h-3" />
                </Button>
            </div>
        </motion.div>
    )
}
