import { getAllMembers } from '@/lib/supabase/data'
import MembersClient from './MembersClient'
import { Member } from '@/types'

export const revalidate = 60

async function safeGetMembers(): Promise<Member[]> {
  try {
    return await getAllMembers()
  } catch {
    return []
  }
}

export default async function MembersPage() {
  const members = await safeGetMembers()

  return <MembersClient initialMembers={members} />
}
