import { HeroSection } from '@/components/landing/hero-section'
import { MissionSection } from '@/components/landing/mission-section'
import { StatsSection } from '@/components/landing/stats-section'
import { EventsSection } from '@/components/landing/events-section'
import { MembersSection } from '@/components/landing/members-section'
import { PartnersSection } from '@/components/landing/partners-section'
import { CommunitySection } from '@/components/landing/community-section'
import { FAQSection } from '@/components/landing/faq-section'
import { CTASection } from '@/components/landing/cta-section'
import { Footer } from '@/components/layout/footer'
import { getFeaturedMembers, getPartners, getTestimonials, getLandingSections, getAllEvents } from '@/lib/supabase/data'
import { Member, Partner, Testimonial, Event } from '@/types'

export const revalidate = 60

async function safeGetData<T>(fn: () => Promise<T>, fallback: T): Promise<T> {
  try {
    return await fn()
  } catch {
    return fallback
  }
}

const fallbackMembers: Member[] = []
const fallbackPartners: Partner[] = []
const fallbackTestimonials: Testimonial[] = []
const fallbackEvents: Event[] = []

export default async function Home() {
  const [featuredMembers, partners, testimonials, allEvents, contentMap] = await Promise.all([
    safeGetData(getFeaturedMembers, fallbackMembers),
    safeGetData(getPartners, fallbackPartners),
    safeGetData(getTestimonials, fallbackTestimonials),
    safeGetData(getAllEvents, fallbackEvents),
    safeGetData(() => getLandingSections(['hero', 'mission', 'stats', 'faq', 'cta']), {})
  ])

  return (
    <main>
      <HeroSection content={contentMap['hero'] || null} />
      <StatsSection content={contentMap['stats'] || null} />
      <MissionSection content={contentMap['mission'] || null} />
      <EventsSection events={allEvents} />
      <MembersSection members={featuredMembers} />
      <PartnersSection partners={partners} />
      <CommunitySection testimonials={testimonials} />
      <FAQSection content={contentMap['faq'] || null} />
      <CTASection content={contentMap['cta'] || null} />

      <Footer />
    </main>
  )
}
