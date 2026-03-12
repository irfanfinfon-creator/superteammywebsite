'use client'

import { useState, useCallback } from 'react'
import { Upload, X, Loader2 } from 'lucide-react'
import { uploadFileAction } from '@/app/admin/actions'
import { cn } from '@/lib/utils'
import Image from 'next/image'

interface ImageUploadProps {
  value?: string
  onChange?: (url: string) => void
  bucket?: string
  folder?: string
  onUploadingChange?: (uploading: boolean) => void
}

export function ImageUpload({ value, onChange, bucket = 'media', folder = 'images', onUploadingChange }: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false)
  const [isDragging, setIsDragging] = useState(false)

  const setUploading = useCallback((uploading: boolean) => {
    setIsUploading(uploading)
    onUploadingChange?.(uploading)
  }, [onUploadingChange])

  const handleUpload = useCallback(async (file: File) => {
    if (!file) return

    setUploading(true)

    try {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('bucket', bucket)
      formData.append('folder', folder)

      const publicUrl = await uploadFileAction(formData)
      onChange?.(publicUrl)
    } catch (error: any) {
      console.error('Upload error:', error)
      alert('Upload failed: ' + error.message)
    } finally {
      setUploading(false)
    }
  }, [bucket, folder, onChange, setUploading])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)

    const file = e.dataTransfer.files[0]
    if (file && file.type.startsWith('image/')) {
      void handleUpload(file)
    }
  }, [handleUpload])

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }, [])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      void handleUpload(file)
    }
  }

  const handleRemove = () => {
    onChange?.('')
  }

  if (value) {
    return (
      <div className="relative w-full h-40 rounded-lg overflow-hidden border border-gray-200">
        <Image src={value} alt="Uploaded" fill unoptimized className="object-cover" />
        <button
          type="button"
          onClick={handleRemove}
          className="absolute top-2 right-2 w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    )
  }

  return (
    <div
      className={cn(
        'relative w-full h-40 rounded-lg border-2 border-dashed transition-colors',
        isDragging ? 'border-purple-500 bg-purple-50' : 'border-gray-300 hover:border-purple-400',
        isUploading && 'opacity-50 pointer-events-none'
      )}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
    >
      <input
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        disabled={isUploading}
      />
      <div className="flex flex-col items-center justify-center h-full text-gray-500">
        {isUploading ? (
          <>
            <Loader2 className="w-8 h-8 animate-spin mb-2" />
            <p className="text-sm">Uploading...</p>
          </>
        ) : (
          <>
            <Upload className="w-8 h-8 mb-2" />
            <p className="text-sm font-medium">Drag & drop or click to upload</p>
            <p className="text-xs text-gray-400">PNG, JPG, GIF up to 5MB</p>
          </>
        )}
      </div>
    </div>
  )
}
