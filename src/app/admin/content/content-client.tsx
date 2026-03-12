'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Pencil, X, Save, Plus, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ImageUpload } from '@/components/ui/image-upload'
import { LandingPageContent } from '@/types'
import { saveContentAction, getAllContentAction } from './actions'

const sections = [
    { key: 'hero', label: 'Hero Section' },
    { key: 'mission', label: 'Mission Section' },
    { key: 'stats', label: 'Stats Section' },
    { key: 'faq', label: 'FAQ Section' },
    { key: 'cta', label: 'Call to Action' },
]

interface StatItem {
    label: string
    value: string
    suffix: string
}

interface MissionItem {
    title: string
    description: string
}

interface FaqItem {
    question: string
    answer: string
}

interface ContentClientProps {
    initialContents: Record<string, LandingPageContent>
}

export default function ContentClient({ initialContents }: ContentClientProps) {
    const [contents, setContents] = useState<Record<string, LandingPageContent>>(initialContents)
    const [editingSection, setEditingSection] = useState<string | null>(null)
    const [formData, setFormData] = useState<Partial<LandingPageContent>>({
        title: '',
        subtitle: '',
        content: '',
        cta_text: '',
        cta_url: '',
        image_url: ''
    })
    const [statsItems, setStatsItems] = useState<StatItem[]>([])
    const [missionItems, setMissionItems] = useState<MissionItem[]>([])
    const [faqItems, setFaqItems] = useState<FaqItem[]>([])
    const [isSaving, setIsSaving] = useState(false)


    useEffect(() => {
        setContents(initialContents)
    }, [initialContents])

    const fetchContents = async () => {
        try {
            const data = await getAllContentAction()
            const contentsMap: Record<string, LandingPageContent> = {}
            data?.forEach((item: LandingPageContent) => {
                contentsMap[item.section] = item
            })
            setContents(contentsMap)
        } catch (err: unknown) {
            console.error('Fetch error:', err instanceof Error ? err.message : err)
        }
    }

    const handleOpenEdit = (sectionKey: string) => {
        const existing = contents[sectionKey]
        if (existing) {
            setFormData(existing)
            if (sectionKey === 'stats') {
                const items = existing.metadata?.items
                setStatsItems(Array.isArray(items) ? items as StatItem[] : [])
            } else if (sectionKey === 'mission') {
                const items = existing.metadata?.items
                setMissionItems(Array.isArray(items) ? items as MissionItem[] : [])
            } else if (sectionKey === 'faq') {
                const items = existing.metadata?.items
                setFaqItems(Array.isArray(items) ? items as FaqItem[] : [])
            }
        } else {
            setFormData({
                title: '',
                subtitle: '',
                content: '',
                cta_text: '',
                cta_url: '',
                image_url: ''
            })
            if (sectionKey === 'stats') setStatsItems([])
            if (sectionKey === 'mission') setMissionItems([])
            if (sectionKey === 'faq') setFaqItems([])
        }
        setEditingSection(sectionKey)
    }

    const handleSave = async () => {
        if (!editingSection || isSaving) {
            return
        }

        setIsSaving(true)

        type SavePayload = {
            title?: string | null
            subtitle?: string | null
            content?: string | null
            cta_text?: string | null
            cta_url?: string | null
            image_url?: string | null
            section: string
            metadata?: { items: StatItem[] | MissionItem[] | FaqItem[] }
        }
        const baseForm = formData as Omit<Partial<LandingPageContent>, 'metadata'>
        const dataToSave: SavePayload = {
            ...baseForm,
            section: editingSection
        }

        if (editingSection === 'stats') {
            dataToSave.metadata = { items: statsItems }
        } else if (editingSection === 'mission') {
            dataToSave.metadata = { items: missionItems }
        } else if (editingSection === 'faq') {
            dataToSave.metadata = { items: faqItems }
        }

        console.log('Data to save:', dataToSave)

        const existing = contents[editingSection]

        try {
            if (existing) {
                console.log('Updating existing record with ID:', existing.id)
                await saveContentAction(dataToSave, existing.id)
            } else {
                console.log('Inserting new record')
                await saveContentAction(dataToSave)
            }

            await fetchContents()
            setEditingSection(null)
        } catch (err) {
            console.error('Save error:', err)
            setIsSaving(false)
            alert('An error occurred while saving')
        } finally {
            setIsSaving(false)
        }
    }

    const addStatItem = () => {
        setStatsItems([...statsItems, { label: '', value: '', suffix: '' }])
    }

    const removeStatItem = (index: number) => {
        setStatsItems(statsItems.filter((_, i) => i !== index))
    }

    const updateStatItem = (index: number, field: keyof StatItem, value: string) => {
        const updated = [...statsItems]
        updated[index] = { ...updated[index], [field]: value }
        setStatsItems(updated)
    }

    const addMissionItem = () => {
        setMissionItems([...missionItems, { title: '', description: '' }])
    }

    const removeMissionItem = (index: number) => {
        setMissionItems(missionItems.filter((_, i) => i !== index))
    }

    const updateMissionItem = (index: number, field: keyof MissionItem, value: string) => {
        const updated = [...missionItems]
        updated[index] = { ...updated[index], [field]: value }
        setMissionItems(updated)
    }

    const addFaqItem = () => {
        setFaqItems([...faqItems, { question: '', answer: '' }])
    }

    const removeFaqItem = (index: number) => {
        setFaqItems(faqItems.filter((_, i) => i !== index))
    }

    const updateFaqItem = (index: number, field: keyof FaqItem, value: string) => {
        const updated = [...faqItems]
        updated[index] = { ...updated[index], [field]: value }
        setFaqItems(updated)
    }

    const renderHeroForm = () => (
        <>
            <div>
                <Label htmlFor="title" className="text-white bg-#0a0a0a border-#1a1a1a">Title</Label>
                <Input
                    id="title"
                    value={formData.title || ''}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="Building the Future of"
                    className="bg-#0a0a0a border-#1a1a1a text-white"
                />
            </div>
            <div>
                <Label htmlFor="subtitle" className="text-white bg-#0a0a0a border-#1a1a1a">Subtitle</Label>
                <Input
                    id="subtitle"
                    value={formData.subtitle || ''}
                    onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                    placeholder="Web3 in Malaysia"
                    className="bg-#0a0a0a border-#1a1a1a text-white"
                />
            </div>
        </>
    )

    const renderMissionForm = () => (
        <>
            <div>
                <Label htmlFor="title" className="text-white bg-#0a0a0a border-#1a1a1a">Section Title</Label>
                <Input
                    id="title"
                    value={formData.title || ''}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="Our Mission"
                    className="bg-#0a0a0a border-#1a1a1a text-white"
                />
            </div>
            <div>
                <Label htmlFor="subtitle" className="text-white bg-#0a0a0a border-#1a1a1a">Subtitle</Label>
                <Input
                    id="subtitle"
                    value={formData.subtitle || ''}
                    onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                    placeholder="What we do"
                    className="bg-#0a0a0a border-#1a1a1a text-white"
                />
            </div>
            <div>
                <div className="flex items-center justify-between mb-2">
                    <Label className="text-white bg-#0a0a0a border-#1a1a1a">Mission Items</Label>
                    <Button type="button" variant="outline" size="sm" onClick={addMissionItem} className="text-white border-#333333 hover:bg-#1a1a1a">
                        <Plus className="w-4 h-4 mr-1" /> Add Item
                    </Button>
                </div>
                <div className="space-y-3">
                    {missionItems.map((item, index) => (
                        <div key={index} className="p-3 border border-#1a1a1a rounded-lg bg-#0a0a0a">
                            <div className="flex justify-between items-center mb-2">
                                <span className="text-sm font-medium text-gray-700">Item {index + 1}</span>
                                <Button type="button" variant="ghost" size="icon" onClick={() => removeMissionItem(index)}>
                                    <Trash2 className="w-4 h-4 text-red-500" />
                                </Button>
                            </div>
                            <div className="grid grid-cols-1 gap-2">
                                <Input
                                    value={item.title}
                                    onChange={(e) => updateMissionItem(index, 'title', e.target.value)}
                                    placeholder="Title"
                                    className="text-white bg-#0a0a0a border-#1a1a1a"
                                />
                                <Textarea
                                    value={item.description}
                                    onChange={(e) => updateMissionItem(index, 'description', e.target.value)}
                                    placeholder="Description"
                                    rows={2}
                                    className="text-white bg-#0a0a0a border-#1a1a1a"
                                />
                            </div>
                        </div>
                    ))}
                    {missionItems.length === 0 && (
                        <p className="text-sm text-gray-500 text-center py-4">No items. Click &quot;Add Item&quot; to add one.</p>
                    )}
                </div>
            </div>
        </>
    )

    const renderStatsForm = () => (
        <>
            <div>
                <Label htmlFor="title" className="text-white bg-#0a0a0a border-#1a1a1a">Section Title</Label>
                <Input
                    id="title"
                    value={formData.title || ''}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="Our Impact"
                    className="text-white bg-#0a0a0a border-#1a1a1a"
                />
            </div>
            <div>
                <div className="flex items-center justify-between mb-2">
                    <Label className="text-white bg-#0a0a0a border-#1a1a1a">Stats Items</Label>
                    <Button type="button" variant="outline" size="sm" onClick={addStatItem} className="text-white bg-#0a0a0a border-#1a1a1a">
                        <Plus className="w-4 h-4 mr-1" /> Add Stat
                    </Button>
                </div>
                <p className="text-xs text-gray-500 mb-3">Max 5 stats per row at 1920x1080 resolution</p>
                <div className="space-y-3">
                    {statsItems.map((item, index) => (
                        <div key={index} className="p-3 border rounded-lg bg-#0a0a0a">
                            <div className="flex justify-between items-center mb-2">
                                <span className="text-sm font-medium text-gray-700">Stat {index + 1}</span>
                                <Button type="button" variant="ghost" size="icon" onClick={() => removeStatItem(index)}>
                                    <Trash2 className="w-4 h-4 text-red-500" />
                                </Button>
                            </div>
                            <div className="grid grid-cols-3 gap-2">
                                <Input
                                    value={item.value}
                                    onChange={(e) => updateStatItem(index, 'value', e.target.value)}
                                    placeholder="Value"
                                    className="text-white bg-#0a0a0a border-#1a1a1a"
                                />
                                <Input
                                    value={item.label}
                                    onChange={(e) => updateStatItem(index, 'label', e.target.value)}
                                    placeholder="Label"
                                    className="text-white bg-#0a0a0a border-#1a1a1a"
                                />
                                <Input
                                    value={item.suffix}
                                    onChange={(e) => updateStatItem(index, 'suffix', e.target.value)}
                                    placeholder="Suffix (optional)"
                                    className="text-white bg-#0a0a0a border-#1a1a1a"
                                />
                            </div>
                        </div>
                    ))}
                    {statsItems.length === 0 && (
                        <p className="text-sm text-gray-500 text-center py-4">No stats. Click &quot;Add Stat&quot; to add one.</p>
                    )}
                </div>
            </div>
        </>
    )

    const renderFaqForm = () => (
        <>
            <div>
                <Label htmlFor="title" className="text-white bg-#0a0a0a border-#1a1a1a">Section Title</Label>
                <Input
                    id="title"
                    value={formData.title || ''}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="Frequently Asked Questions"
                    className="text-white bg-#0a0a0a border-#1a1a1a"
                />
            </div>
            <div>
                <div className="flex items-center justify-between mb-2">
                    <Label className="text-white bg-#0a0a0a border-#1a1a1a">Questions</Label>
                    <Button type="button" variant="outline" size="sm" onClick={addFaqItem} className="text-white bg-#0a0a0a border-#1a1a1a">
                        <Plus className="w-4 h-4 mr-1" /> Add Question
                    </Button>
                </div>
                <div className="space-y-3">
                    {faqItems.map((item, index) => (
                        <div key={index} className="p-3 border rounded-lg bg-#0a0a0a">
                            <div className="flex justify-between items-center mb-2">
                                <span className="text-sm font-medium text-gray-700">Question {index + 1}</span>
                                <Button type="button" variant="ghost" size="icon" onClick={() => removeFaqItem(index)}>
                                    <Trash2 className="w-4 h-4 text-red-500" />
                                </Button>
                            </div>
                            <div className="grid grid-cols-1 gap-2">
                                <Input
                                    value={item.question}
                                    onChange={(e) => updateFaqItem(index, 'question', e.target.value)}
                                    placeholder="Question"
                                    className="text-white bg-#0a0a0a border-#1a1a1a"
                                />
                                <Textarea
                                    value={item.answer}
                                    onChange={(e) => updateFaqItem(index, 'answer', e.target.value)}
                                    placeholder="Answer"
                                    rows={2}
                                    className="text-white bg-#0a0a0a border-#1a1a1a"
                                />
                            </div>
                        </div>
                    ))}
                    {faqItems.length === 0 && (
                        <p className="text-sm text-gray-500 text-center py-4">No questions. Click &quot;Add Question&quot; to add one.</p>
                    )}
                </div>
            </div>
        </>
    )

    const renderCtaForm = () => (
        <>
            <div>
                <Label htmlFor="title" className="text-white bg-#0a0a0a border-#1a1a1a">Title</Label>
                <Textarea
                    id="title"
                    value={formData.title || ''}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="No need to build alone."
                    rows={2}
                    className="text-white bg-#0a0a0a border-#1a1a1a"
                />
            </div>
            <div>
                <Label htmlFor="subtitle" className="text-white bg-#0a0a0a border-#1a1a1a">Subtitle</Label>
                <Textarea
                    id="subtitle"
                    value={formData.subtitle || ''}
                    onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                    placeholder="Join our community..."
                    rows={2}
                    className="text-white bg-#0a0a0a border-#1a1a1a"
                />
            </div>
        </>
    )

    const renderFooterForm = () => (
        <>
            <div>
                <Label htmlFor="title" className="text-white bg-#0a0a0a border-#1a1a1a">Title</Label>
                <Input
                    id="title"
                    value={formData.title || ''}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="Footer title"
                    className="text-white bg-#0a0a0a border-#1a1a1a"
                />
            </div>
            <div>
                <Label htmlFor="subtitle" className="text-white bg-#0a0a0a border-#1a1a1a">Subtitle</Label>
                <Input
                    id="subtitle"
                    value={formData.subtitle || ''}
                    onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                    placeholder="Footer subtitle"
                    className="text-white bg-#0a0a0a border-#1a1a1a"
                />
            </div>
            <div>
                <Label htmlFor="content" className="text-white bg-#0a0a0a border-#1a1a1a">Content</Label>
                <Textarea
                    id="content"
                    value={formData.content || ''}
                    onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                    placeholder="Footer content..."
                    rows={4}
                    className="text-white bg-#0a0a0a border-#1a1a1a"
                />
            </div>
            <div>
                <Label className="text-white bg-#0a0a0a border-#1a1a1a">Section Image</Label>
                <ImageUpload
                    value={formData.image_url || ''}
                    onChange={(url) => setFormData({ ...formData, image_url: url })}
                    folder="content"
                />
            </div>
        </>
    )

    const renderForm = () => {
        switch (editingSection) {
            case 'hero':
                return renderHeroForm()
            case 'mission':
                return renderMissionForm()
            case 'stats':
                return renderStatsForm()
            case 'faq':
                return renderFaqForm()
            case 'cta':
                return renderCtaForm()
            case 'footer':
                return renderFooterForm()
            default:
                return null
        }
    }

    return (
        <div>
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-white">Content Management</h1>
                <p className="text-gray-400">Edit landing page content</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {sections.map((section) => {
                    const content = contents[section.key]
                    return (
                        <Card key={section.key} className="bg-[#111111] border-#1a1a1a">
                            <CardHeader className="flex flex-row items-center justify-between pb-2">
                                <CardTitle className="text-lg text-white">{section.label}</CardTitle>
                                <Button variant="ghost" size="icon" onClick={() => handleOpenEdit(section.key)} className="text-gray-300 hover:text-white hover:bg-#1a1a1a">
                                    <Pencil className="w-4 h-4" />
                                </Button>
                            </CardHeader>
                            <CardContent>
                                {content ? (
                                    <div className="space-y-2">
                                        <p className="font-medium text-white">{content.title || '(No title)'}</p>
                                        <p className="text-sm text-gray-400 truncate">{content.subtitle || '(No subtitle)'}</p>
                                        {content.cta_text && (
                                            <p className="text-xs text-white">CTA: {content.cta_text}</p>
                                        )}
                                        {Array.isArray(content.metadata?.items) && content.metadata.items.length > 0 && (
                                            <p className="text-xs text-blue-400">Items: {content.metadata.items.length}</p>
                                        )}
                                    </div>
                                ) : (
                                    <p className="text-sm text-gray-500">No content set</p>
                                )}
                            </CardContent>
                        </Card>
                    )
                })}
            </div>

            <AnimatePresence>
                {editingSection && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4"
                    >
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.95, opacity: 0 }}
                            className="bg-[#111111] rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto border border-#1a1a1a"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="flex items-center justify-between p-6 border-b border-#1a1a1a">
                                <h2 className="text-xl font-bold text-white">Edit {sections.find(s => s.key === editingSection)?.label}</h2>
                                <Button variant="ghost" size="icon" onClick={() => setEditingSection(null)} className="text-gray-300 hover:text-white">
                                    <X className="w-5 h-5" />
                                </Button>
                            </div>

                            <div className="p-6 space-y-4">
                                {renderForm()}
                            </div>

                            <div className="flex items-center justify-end gap-4 p-6 border-t border-#1a1a1a">
                                <Button type="button" variant="outline" className="text-white border-#333333 hover:bg-#1a1a1a" onClick={() => setEditingSection(null)} disabled={isSaving}>Cancel</Button>
                                <Button type="button" onClick={handleSave} disabled={isSaving} className="bg-white text-black hover:bg-gray-200">
                                    <Save className="w-4 h-4 mr-2" />
                                    {isSaving ? 'Saving...' : 'Save Changes'}
                                </Button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}
