import SetupClient from './setup-client'
import { getInvitationByToken } from '@/lib/supabase/data'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

interface SetupPageProps {
  params: Promise<{ token: string }>
}

export default async function SetupPage({ params }: SetupPageProps) {
  const { token } = await params
  
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (user) {
    redirect('/admin')
  }
  
  const invitation = await getInvitationByToken(token)
  
  if (!invitation) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#040507]">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-2">Invalid Invitation</h1>
          <p className="text-gray-400">
            This invitation link is invalid or has already been used.
          </p>
        </div>
      </div>
    )
  }
  
  if (invitation.status !== 'pending') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#040507]">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-2">Invitation Already Used</h1>
          <p className="text-gray-400">
            This invitation has already been completed or expired.
          </p>
        </div>
      </div>
    )
  }
  
  const now = new Date()
  const expiresAt = new Date(invitation.expires_at)
  if (now > expiresAt) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#040507]">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-2">Invitation Expired</h1>
          <p className="text-gray-400">
            This invitation has expired. Please contact your admin for a new invitation.
          </p>
        </div>
      </div>
    )
  }
  
  return <SetupClient token={token} />
}
