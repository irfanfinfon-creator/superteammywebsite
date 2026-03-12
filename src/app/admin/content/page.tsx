import { createClient } from '@/lib/supabase/server'
import ContentClient from './content-client'
import { LandingPageContent } from '@/types'

export default async function AdminContentPage() {
  const supabase = await createClient()

  if (!supabase) return null

  // Fetch data on the Server
  const { data } = await supabase
    .from('landing_page_content')
    .select('*')

  const contentsMap: Record<string, LandingPageContent> = {}
  data?.forEach((item: LandingPageContent) => {
    contentsMap[item.section] = item
  })

  return <ContentClient initialContents={contentsMap} />
}
