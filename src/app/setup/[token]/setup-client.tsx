'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { createAdminUser } from './actions'
import Image from 'next/image'

interface SetupClientProps {
  token: string
}

export default function SetupClient({ token }: SetupClientProps) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (password !== confirmPassword) {
      setError('Passwords do not match')
      return
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters')
      return
    }

    setLoading(true)

    const result = await createAdminUser(token, email, password)

    if (!result.success) {
      setError(result.error || 'Failed to create account')
      setLoading(false)
      return
    }

    router.push('/login?message=Account created successfully! You can now login.')
  }

  return (
    <div className='grid grid-cols-2'>
      <div className="min-h-screen flex items-center justify-center bg-[#040507] bg-[url('/klsenja.svg')] bg-cover bg-center">
        <div className='w-full max-w-md flex flex-col'>

          <div className="flex items-center justify-center gap-2 mb-4">
            <Image src="/SuperteamMYlogo.svg" alt="Logo" width={500} height={500} priority />
          </div>
        </div>
      </div>
      <div className="flex flex-col items-center justify-center bg-[#040507]">
        <div className='w-full max-w-md'>
          <div className="flex flex-col items-start justify-center gap-2 mb-4">
            <h1 className='text-white text-4xl font-bold'>Admin Setup</h1>
            <p className='text-white'>Create your admin account to access the CMS</p>
          </div>
        </div>
        <Card className="w-full max-w-md bg-[#1a1a1a] border-white/20">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl text-white text-left">Complete Your Setup</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="p-3 text-sm text-red-500 bg-red-50 rounded-md">
                  {error}
                </div>
              )}
              <div className="space-y-2 text-white">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  className='bg-[#1a1a1a] border-white/20'
                  placeholder="admin@superteam.my"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2 text-white">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  className='bg-[#1a1a1a] border-white/20'
                  placeholder="Create a password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2 text-white">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  className='bg-[#1a1a1a] border-white/20'
                  placeholder="Confirm your password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </div>
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? 'Creating Account...' : 'Create Account'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
