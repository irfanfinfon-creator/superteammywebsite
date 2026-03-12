'use client'

import { useState } from 'react'

interface Announcement {
  title: string
  content: string
}

interface AnnouncementBarProps {
  announcements: Announcement[]
}

export function AnnouncementBar({ announcements }: AnnouncementBarProps) {
  const [isPaused, setIsPaused] = useState(false)

  if (!announcements || announcements.length === 0) {
    return (
      <div className="bg-blue-600 text-white py-2 px-4 text-center text-sm font-medium">
        Welcome to Superteam Malaysia!
      </div>
    )
  }

  const displayItems = announcements.length === 1 
    ? [...announcements, ...announcements] 
    : [...announcements, ...announcements]

  return (
    <div 
      className="bg-blue-600 text-white py-2 overflow-hidden"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div 
        className={`inline-flex whitespace-nowrap marquee ${isPaused ? 'paused' : ''}`}
      >
        {displayItems.map((item, index) => (
          <span 
            key={index} 
            className="inline-flex items-center px-8"
          >
            <span className="font-bold mr-2">{item.title}</span>
            <span className="font-normal">{item.content}</span>
            {index < displayItems.length - 1 && (
              <span className="mx-4">•</span>
            )}
          </span>
        ))}
      </div>
    </div>
  )
}
