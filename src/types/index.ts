export interface Member {
  id: string
  name: string
  photo_url: string | null
  role: string | null
  company: string | null
  skills: string[]
  twitter_url: string | null
  hackathon_wins: number
  projects_built: number
  grants_received: number
  dao_contributions: number
  bounties_completed: number
  is_featured: boolean
  created_at: string
  special_badge: string[] | null
}

export interface Event {
  id: string
  title: string
  description: string | null
  date: string | null
  location: string | null
  image_url: string | null
  luma_url: string | null
  is_upcoming: boolean
  created_at: string
}

export interface Partner {
  id: string
  name: string
  logo_url: string | null
  website_url: string | null
  is_active: boolean
  created_at: string
}

export interface Testimonial {
  id: string
  tweet_url: string
  is_featured: boolean
  created_at: string
}

export interface Announcement {
  id: string
  title: string
  content: string | null
  image_url: string | null
  is_published: boolean
  published_at: string | null
  created_at: string
}

export interface LandingPageContent {
  id: string
  section: string
  title: string | null
  subtitle: string | null
  content: string | null
  cta_text: string | null
  cta_url: string | null
  image_url: string | null
  metadata: Record<string, unknown>
  created_at: string
  updated_at: string
}

export interface AdminUser {
  id: string
  email: string
  role: 'admin'
  created_at: string
}

export interface AdminInvitation {
  id: string
  token: string
  email: string | null
  invited_by: string | null
  status: 'pending' | 'completed' | 'expired'
  expires_at: string
  created_at: string
}
