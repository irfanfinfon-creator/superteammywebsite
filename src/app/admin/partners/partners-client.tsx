'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Pencil, Trash2, X, Search, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent } from '@/components/ui/card'
import { ImageUpload } from '@/components/ui/image-upload'
import { Partner } from '@/types'
import Image from 'next/image'
import { savePartnerAction, deletePartnerAction } from './actions'

interface PartnersClientProps {
    initialPartners: Partner[]
}

export default function PartnersClient({ initialPartners }: PartnersClientProps) {
    const [partners, setPartners] = useState<Partner[]>(initialPartners)
    const [searchQuery, setSearchQuery] = useState('')
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [editingPartner, setEditingPartner] = useState<Partner | null>(null)
    const [isLogoUploading, setIsLogoUploading] = useState(false)
    const [isSaving, setIsSaving] = useState(false)
    const [saveError, setSaveError] = useState('')
    const [formData, setFormData] = useState<Partial<Partner>>({
        name: '',
        logo_url: '',
        website_url: '',
        is_active: true
    })


    useEffect(() => {
        setPartners(initialPartners)
    }, [initialPartners])


    const filteredPartners = partners.filter(partner =>
        partner.name?.toLowerCase().includes(searchQuery.toLowerCase())
    )

    const handleOpenModal = (partner?: Partner) => {
        if (partner) {
            setEditingPartner(partner)
            setFormData(partner)
        } else {
            setEditingPartner(null)
            setFormData({ name: '', logo_url: '', website_url: '', is_active: true })
        }
        setIsModalOpen(true)
    }

    const handleSave = async () => {
        if (!formData.name) {
            alert('Partner name is required.')
            return
        }

        setIsSaving(true)
        setSaveError('')

        try {
            if (editingPartner) {
                const updated = await savePartnerAction(formData, editingPartner.id)
                setPartners(prev => prev.map(p => p.id === editingPartner.id ? (updated as Partner) : p))
            } else {
                const created = await savePartnerAction(formData)
                setPartners(prev => [created as Partner, ...prev])
            }
            setIsModalOpen(false)
            setEditingPartner(null)
        } catch (err: unknown) {
            console.error('Partner save error:', err)
            const message = err instanceof Error ? err.message : 'An unexpected error occurred while saving.'
            setSaveError(message)
        } finally {
            setIsSaving(false)
        }
    }

    const handleDelete = async (id: string) => {
        if (confirm('Are you sure you want to delete this partner?')) {
            try {
                await deletePartnerAction(id)
                setPartners(prev => prev.filter(p => p.id !== id))
            } catch (err: any) {
                alert('Failed to delete partner: ' + err.message)
            }
        }
    }

    return (
        <div>
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-white">Partners</h1>
                    <p className="text-gray-400">Manage ecosystem partners</p>
                </div>
                <Button onClick={() => handleOpenModal()} className="bg-white text-black hover:bg-gray-200">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Partner
                </Button>
            </div>

            <div className="mb-6">
                <div className="relative max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <Input
                        placeholder="Search partners..."
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
                                    <th className="text-left px-6 py-4 text-sm font-medium text-gray-300">Partner</th>
                                    <th className="text-left px-6 py-4 text-sm font-medium text-gray-300">Website</th>
                                    <th className="text-left px-6 py-4 text-sm font-medium text-gray-300">Status</th>
                                    <th className="text-right px-6 py-4 text-sm font-medium text-gray-300">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-#1a1a1a bg-[#111111]">
                                {filteredPartners.map((partner) => (
                                    <tr key={partner.id} className="hover:bg-#1a1a1a/50">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <Image
                                                    src={partner.logo_url || 'https://via.placeholder.com/40'}
                                                    alt={partner.name}
                                                    width={48}
                                                    height={48}
                                                    unoptimized
                                                    className="rounded-lg object-contain bg-#1a1a1a"
                                                />
                                                <span className="font-medium text-white">{partner.name}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            {partner.website_url ? (
                                                <a href={partner.website_url} target="_blank" rel="noopener noreferrer" className="text-white hover:underline">
                                                    Visit Website →
                                                </a>
                                            ) : '-'}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={partner.is_active ? 'text-green-400' : 'text-gray-500'}>
                                                {partner.is_active ? 'Active' : 'Inactive'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center justify-end gap-2">
                                                <Button variant="ghost" size="icon" onClick={() => handleOpenModal(partner)} className="text-gray-300 hover:text-white hover:bg-#1a1a1a">
                                                    <Pencil className="w-4 h-4" />
                                                </Button>
                                                <Button variant="ghost" size="icon" onClick={() => handleDelete(partner.id)} className="text-red-400 hover:text-red-300 hover:bg-#1a1a1a">
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
                            className="bg-[#111111] rounded-xl w-full max-w-md border border-#1a1a1a"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="flex items-center justify-between p-6 border-b border-#1a1a1a">
                                <h2 className="text-xl font-bold text-white">{editingPartner ? 'Edit Partner' : 'Add New Partner'}</h2>
                                <Button variant="ghost" size="icon" onClick={() => setIsModalOpen(false)} className="text-gray-300 hover:text-white">
                                    <X className="w-5 h-5" />
                                </Button>
                            </div>

                            <div className="p-6 space-y-4">
                                <div>
                                    <Label htmlFor="name" className="text-white">Name</Label>
                                    <Input
                                        id="name"
                                        value={formData.name || ''}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        placeholder="Partner name"
                                        className="bg-#0a0a0a border-#1a1a1a text-white"
                                    />
                                </div>

                                <div>
                                    <Label className="text-white">Partner Logo</Label>
                                    <ImageUpload
                                        value={formData.logo_url || ''}
                                        onChange={(url) => setFormData({ ...formData, logo_url: url })}
                                        folder="partners"
                                        onUploadingChange={setIsLogoUploading}
                                    />
                                </div>

                                <div>
                                    <Label htmlFor="website_url" className="text-white">Website URL</Label>
                                    <Input
                                        id="website_url"
                                        value={formData.website_url || ''}
                                        onChange={(e) => setFormData({ ...formData, website_url: e.target.value })}
                                        placeholder="https://..."
                                        className="bg-#0a0a0a border-#1a1a1a text-white"
                                    />
                                </div>

                                <div className="flex items-center gap-2">
                                    <input
                                        type="checkbox"
                                        id="is_active"
                                        checked={formData.is_active || false}
                                        onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                                        className="w-4 h-4 rounded border-#333333 bg-#0a0a0a"
                                    />
                                    <Label htmlFor="is_active" className="font-normal text-white">
                                        Active
                                    </Label>
                                </div>
                            </div>

                            <div className="flex flex-col gap-2 p-6 border-t border-#1a1a1a">
                                {saveError && (
                                    <p className="text-sm text-red-400 text-center">
                                        {saveError}
                                    </p>
                                )}
                                <div className="flex items-center justify-end gap-4">
                                    <Button
                                        variant="outline"
                                        className="text-white border-#333333 hover:bg-#1a1a1a"
                                        onClick={() => setIsModalOpen(false)}
                                        disabled={isSaving}
                                    >
                                        Cancel
                                    </Button>
                                    <Button
                                        onClick={handleSave}
                                        disabled={isLogoUploading || isSaving}
                                        className="bg-white text-black hover:bg-gray-200"
                                    >
                                        {isSaving && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                                        {editingPartner ? 'Save Changes' : 'Add Partner'}
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
