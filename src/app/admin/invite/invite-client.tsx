'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import {
  createInvitationAction,
  getPendingInvitationsAction,
  deleteInvitationAction
} from '../actions'
import { AdminInvitation } from '@/types'
import { Trash2, Copy, Check, RefreshCw } from 'lucide-react'

interface InviteClientProps {
  userId: string
}

export default function InviteClient({ userId }: InviteClientProps) {
  const [invitations, setInvitations] = useState<AdminInvitation[]>([])
  const [loading, setLoading] = useState<boolean | null>(null)
  const [generating, setGenerating] = useState(false)
  const [copiedId, setCopiedId] = useState<string | null>(null)

  const loadInvitations = async () => {
    setLoading(true)
    try {
      const data = await getPendingInvitationsAction()
      setInvitations(data as AdminInvitation[])
    } catch (err: unknown) {
      console.error('Failed to load invitations:', err instanceof Error ? err.message : err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadInvitations()
  }, [])

  if (loading === null || loading === true && invitations.length === 0) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Invite New Admin</h1>
        </div>
        <div className="text-center py-8 text-gray-400">Loading...</div>
      </div>
    )
  }

  const handleGenerateInvite = async () => {
    setGenerating(true)
    try {
      await createInvitationAction(userId)
      await loadInvitations()
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'An unexpected error occurred'
      alert('Failed to generate invite: ' + message)
    } finally {
      setGenerating(false)
    }
  }

  const handleCopyToken = async (token: string, id: string) => {
    const inviteUrl = `${window.location.origin}/setup/${token}`
    await navigator.clipboard.writeText(inviteUrl)
    setCopiedId(id)
    setTimeout(() => setCopiedId(null), 2000)
  }

  const handleDelete = async (id: string) => {
    try {
      await deleteInvitationAction(id)
      await loadInvitations()
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'An unexpected error occurred'
      alert('Failed to delete invitation: ' + message)
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const isExpired = (expiresAt: string) => {
    return new Date(expiresAt) < new Date()
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Invite New Admin</h1>
        <p className="text-gray-400">
          Generate an invitation token to invite new team members to the admin panel.
        </p>
      </div>

      <Card className="bg-[#111111] border-[#1a1a1a] mb-8">
        <CardHeader>
          <CardTitle className="text-white">Generate New Invitation</CardTitle>
          <CardDescription className="text-gray-400">
            Create a unique token that you can share with your new team member.
            The invitation will expire in 7 days.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button
            onClick={handleGenerateInvite}
            disabled={generating}
            className="w-full"
          >
            {generating ? (
              <>
                <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                Generating...
              </>
            ) : (
              'Generate Invite Token'
            )}
          </Button>
        </CardContent>
      </Card>

      <Card className="bg-[#111111] border-[#1a1a1a]">
        <CardHeader>
          <CardTitle className="text-white">Active Invitations</CardTitle>
          <CardDescription className="text-gray-400">
            Manage your pending invitations. Only invitations with valid tokens are shown.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8 text-gray-400">Loading...</div>
          ) : invitations.length === 0 ? (
            <div className="text-center py-8 text-gray-400">
              No active invitations. Generate one above to invite a new admin.
            </div>
          ) : (
            <div className="space-y-4">
              {invitations.map((invite) => (
                <div
                  key={invite.id}
                  className="flex items-center justify-between p-4 bg-[#0a0a0a] border border-[#1a1a1a] rounded-lg"
                >
                  <div className="flex-1 min-w-0 mr-4">
                    <div className="flex items-center gap-2">
                      <span className="text-white font-mono text-sm">
                        {invite.token}
                      </span>
                      {isExpired(invite.expires_at) && (
                        <span className="text-xs text-red-500 bg-red-500/10 px-2 py-0.5 rounded">
                          Expired
                        </span>
                      )}
                    </div>
                    <p className="text-gray-500 text-sm mt-1">
                      Created: {formatDate(invite.created_at)} •
                      Expires: {formatDate(invite.expires_at)}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleCopyToken(invite.token, invite.id)}
                      className="text-gray-400 hover:text-white"
                    >
                      {copiedId === invite.id ? (
                        <Check className="w-4 h-4 text-green-500" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(invite.id)}
                      className="text-gray-400 hover:text-red-500"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
