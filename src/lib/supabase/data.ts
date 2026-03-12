import type { SupabaseClient } from '@supabase/supabase-js'
import { createClient as createPublicClient } from '@supabase/supabase-js'
import { createClient } from '@/lib/supabase/client'
import { LandingPageContent } from '@/types'

function getPublicSupabase(): SupabaseClient | null {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  if (!supabaseUrl || !supabaseKey) return null
  return createPublicClient(supabaseUrl, supabaseKey)
}

export async function getFeaturedMembers() {
  const supabase = getPublicSupabase()
  if (!supabase) return []
  const { data } = await supabase
    .from('members')
    .select('id,name,photo_url,role,company,skills,hackathon_wins,projects_built,grants_received,dao_contributions,bounties_completed,is_featured,created_at,twitter_url,special_badge')
    .eq('is_featured', true)
    .limit(8)
  return data || []
}

export async function getAllMembers() {
  const supabase = getPublicSupabase()
  if (!supabase) return []
  const { data } = await supabase
    .from('members')
    .select('id,name,photo_url,role,company,skills,hackathon_wins,projects_built,grants_received,dao_contributions,bounties_completed,is_featured,created_at,twitter_url,special_badge')
    .order('is_featured', { ascending: false })
  return data || []
}

export async function getPartners() {
  const supabase = getPublicSupabase()
  if (!supabase) return []
  const { data } = await supabase
    .from('partners')
    .select('id,name,logo_url,website_url,is_active,created_at')
    .eq('is_active', true)
    .order('created_at', { ascending: false })
  return data || []
}

export async function getTestimonials() {
  const supabase = getPublicSupabase()
  if (!supabase) return []
  const { data } = await supabase
    .from('testimonials')
    .select('id,tweet_url,is_featured,created_at')
    .eq('is_featured', true)
    .order('created_at', { ascending: false })
  return data || []
}

export async function getEvents(isUpcoming: boolean) {
  const supabase = getPublicSupabase()
  if (!supabase) return []
  const { data } = await supabase
    .from('events')
    .select('id,title,description,date,location,image_url,luma_url,is_upcoming,created_at')
    .eq('is_upcoming', isUpcoming)
    .order('date', { ascending: true })
  return data || []
}

export async function getAllEvents() {
  const supabase = getPublicSupabase()
  if (!supabase) return []
  const { data } = await supabase
    .from('events')
    .select('id,title,description,date,location,image_url,luma_url,is_upcoming,created_at')
    .order('date', { ascending: false })
  return data || []
}

export async function getLandingContent(section: string) {
  const supabase = getPublicSupabase()
  if (!supabase) return null
  const { data } = await supabase
    .from('landing_page_content')
    .select('id,section,title,subtitle,content,cta_text,cta_url,image_url,metadata,created_at,updated_at')
    .eq('section', section)
    .single()
  return data
}

export async function getStatsContent() {
  const supabase = getPublicSupabase()
  if (!supabase) return null
  const { data } = await supabase
    .from('landing_page_content')
    .select('id,section,title,subtitle,content,image_url,metadata,created_at,updated_at')
    .eq('section', 'stats')
    .single()
  return data
}

export async function getFaqContent() {
  const supabase = getPublicSupabase()
  if (!supabase) return null
  const { data } = await supabase
    .from('landing_page_content')
    .select('id,section,title,subtitle,content,image_url,metadata,created_at,updated_at')
    .eq('section', 'faq')
    .single()
  return data
}

export async function getHeroContent() {
  const supabase = getPublicSupabase()
  if (!supabase) return null
  const { data } = await supabase
    .from('landing_page_content')
    .select('id,section,title,subtitle,content,image_url,metadata,created_at,updated_at')
    .eq('section', 'hero')
    .single()
  return data
}

export async function getMissionContent() {
  const supabase = getPublicSupabase()
  if (!supabase) return null
  const { data } = await supabase
    .from('landing_page_content')
    .select('id,section,title,subtitle,content,image_url,metadata,created_at,updated_at')
    .eq('section', 'mission')
    .single()
  return data
}

export async function getCtaContent() {
  const supabase = getPublicSupabase()
  if (!supabase) return null
  const { data } = await supabase
    .from('landing_page_content')
    .select('id,section,title,subtitle,content,cta_text,cta_url,image_url,metadata,created_at,updated_at')
    .eq('section', 'cta')
    .single()
  return data
}

export async function getLandingSections(sections: string[]): Promise<Record<string, LandingPageContent>> {
  const supabase = getPublicSupabase()
  if (!supabase || sections.length === 0) return {} as Record<string, LandingPageContent>
  const { data } = await supabase
    .from('landing_page_content')
    .select('id,section,title,subtitle,content,cta_text,cta_url,image_url,metadata,created_at,updated_at')
    .in('section', sections)
  const map: Record<string, LandingPageContent> = {} as Record<string, LandingPageContent>
  for (const row of data || []) {
    map[row.section] = row as LandingPageContent
  }
  return map
}

export async function getPublishedAnnouncements() {
  const supabase = getPublicSupabase()
  if (!supabase) return []
  const { data } = await supabase
    .from('announcements')
    .select('title, content')
    .eq('is_published', true)
    .order('published_at', { ascending: false })
    .limit(5)
  return data || []
}

export async function getPendingInvitations(supabaseClient?: SupabaseClient) {
  const supabase = supabaseClient || getPublicSupabase()
  if (!supabase) return []
  const { data } = await supabase
    .from('admin_invitations')
    .select('id, token, email, invited_by, status, expires_at, created_at')
    .eq('status', 'pending')
    .order('created_at', { ascending: false })
  return data || []
}

export async function getInvitationByToken(token: string) {
  const supabase = getPublicSupabase()
  if (!supabase) return null
  const { data } = await supabase
    .from('admin_invitations')
    .select('id, token, email, invited_by, status, expires_at, created_at')
    .eq('token', token)
    .single()
  return data
}

export async function createInvitation(invitedById: string, supabaseClient?: SupabaseClient) {
  const supabase = supabaseClient || getPublicSupabase()
  if (!supabase) return null
  
  const expiresAt = new Date()
  expiresAt.setDate(expiresAt.getDate() + 7)
  
  // Generate token in JS (8 characters, cryptographically secure)
  const token = 'st-' + crypto.randomUUID().substring(0, 8)
  
  const { data, error } = await supabase
    .from('admin_invitations')
    .insert({
      token: token,
      invited_by: invitedById,
      expires_at: expiresAt.toISOString()
    })
    .select()
    .single()
  
  if (error) {
    console.error('Error creating invitation:', error)
    return null
  }
  return data
}

export async function completeInvitation(
  token: string, 
  email: string, 
  userId: string
) {
  const supabase = getPublicSupabase()
  if (!supabase) return { success: false, error: 'No supabase client' }
  
  const { data: invitation, error: fetchError } = await supabase
    .from('admin_invitations')
    .select('id, status, expires_at')
    .eq('token', token)
    .single()
  
  if (fetchError || !invitation) {
    return { success: false, error: 'Invalid invitation' }
  }
  
  if (invitation.status !== 'pending') {
    return { success: false, error: 'Invitation already used or expired' }
  }
  
  const now = new Date()
  const expiresAt = new Date(invitation.expires_at)
  if (now > expiresAt) {
    return { success: false, error: 'Invitation has expired' }
  }
  
  const { error: updateError } = await supabase
    .from('admin_invitations')
    .update({ 
      status: 'completed',
      email: email 
    })
    .eq('id', invitation.id)
  
  if (updateError) {
    return { success: false, error: updateError.message }
  }
  
  const { error: adminError } = await supabase
    .from('admin_users')
    .insert({
      id: userId,
      email: email,
      role: 'admin'
    })
  
  if (adminError) {
    return { success: false, error: adminError.message }
  }
  
  return { success: true, error: null }
}

export async function deleteInvitation(id: string, supabaseClient?: SupabaseClient) {
  const supabase = supabaseClient || getPublicSupabase()
  if (!supabase) return { success: false, error: 'No supabase client' }
  
  const { error } = await supabase
    .from('admin_invitations')
    .delete()
    .eq('id', id)
  
  if (error) {
    return { success: false, error: error.message }
  }
  return { success: true, error: null }
}

export async function getAllAdmins() {
  const supabase = createClient()
  const { data } = await supabase
    .from('admin_users')
    .select('id, email, role, created_at')
    .order('created_at', { ascending: false })
  return data || []
}

export async function deleteAdmin(id: string) {
  const supabase = createClient()
  const { error } = await supabase
    .from('admin_users')
    .delete()
    .eq('id', id)
  
  if (error) {
    return { success: false, error: error.message }
  }
  return { success: true, error: null }
}
