'use client'

import { useState, useEffect } from 'react'
import { Trash2, User, Shield } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { deleteAdminAction } from '../actions'

interface AdminUser {
  id: string
  email: string
  role: string
  created_at: string
}

interface AdminsClientProps {
  initialAdmins: AdminUser[]
  currentUserId: string
}

export default function AdminsClient({ initialAdmins, currentUserId }: AdminsClientProps) {
  const [admins, setAdmins] = useState<AdminUser[]>(initialAdmins)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    setAdmins(initialAdmins)
  }, [initialAdmins])

  const handleDelete = async (id: string) => {
    if (id === currentUserId) {
      alert('You cannot delete yourself!')
      return
    }

    const confirmDelete = window.confirm('Are you sure you want to remove this admin? They will no longer be able to access the CMS.')
    if (!confirmDelete) return

    setLoading(true)
    try {
      await deleteAdminAction(id)
      setAdmins(admins.filter(admin => admin.id !== id))
    } catch (err: any) {
      alert(err.message || 'Failed to delete admin')
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    })
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Admin Management</h1>
        <p className="text-gray-400">
          View and manage admin access to the CMS.
        </p>
      </div>

      <Card className="bg-[#111111] border-[#1a1a1a]">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Shield className="w-5 h-5" />
            All Admins
          </CardTitle>
          <CardDescription className="text-gray-400">
            Current administrators with access to this CMS.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {admins.length === 0 ? (
            <div className="text-center py-8 text-gray-400">
              No admins found.
            </div>
          ) : (
            <div className="space-y-3">
              {admins.map((admin) => (
                <div 
                  key={admin.id}
                  className="flex items-center justify-between p-4 bg-[#0a0a0a] border border-[#1a1a1a] rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-[#1a1a1a] flex items-center justify-center">
                      <User className="w-5 h-5 text-gray-400" />
                    </div>
                    <div>
                      <p className="text-white font-medium">
                        {admin.email}
                        {admin.id === currentUserId && (
                          <span className="ml-2 text-xs text-green-500">(You)</span>
                        )}
                      </p>
                      <p className="text-gray-500 text-sm">
                        Joined: {formatDate(admin.created_at)}
                      </p>
                    </div>
                  </div>
                  {admin.id !== currentUserId && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(admin.id)}
                      disabled={loading}
                      className="text-gray-400 hover:text-red-500"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
