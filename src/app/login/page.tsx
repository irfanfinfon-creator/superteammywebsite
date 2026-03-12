'use client'

import { Suspense, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useAuth } from '@/contexts/auth-context'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import Image from 'next/image'

function LoginForm() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { signIn } = useAuth()
  const router = useRouter()
  const searchParams = useSearchParams()

  const message = searchParams.get('message')
  const initialMessage = message || ''

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    const { error } = await signIn(email, password)

    if (error) {
      setError(error.message)
      setLoading(false)
    } else {
      router.push('/admin')
    }
  }

  return (
    <div className='grid grid-cols-2'>
      <div className="min-h-screen flex items-center justify-center bg-[#040507] bg-[url('/klsenja.svg')] bg-cover bg-center">
        <div className='w-full max-w-md'>
          <div className="flex items-center justify-center gap-2 mb-4">
            <Image src="/SuperteamMYlogo.svg" alt="Logo" width={500} height={500} priority />
          </div>
        </div>
      </div>

      <div className="flex flex-col items-center justify-center bg-[#040507]">
        <div className='w-full max-w-md'>
          <div className="flex flex-col items-start justify-center gap-2 mb-4">
            <h1 className='text-white text-4xl font-bold'>Sign In, Admin</h1>
            <p className='text-white'>Sign in to your admin account to access the CMS</p>
            <p className='text-gray-400 text-xs'>Get in touch with your team's in-charge
              if you encounter any issue.</p>
          </div>
        </div>

        <Card className="w-full max-w-md bg-[#1a1a1a] border-white/20">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl text-white text-left">Admin Login</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {initialMessage && (
                <div className="p-3 text-sm text-green-500 bg-green-50 rounded-md">
                  {initialMessage}
                </div>
              )}
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
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? 'Signing in...' : 'Sign In'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-[#040507]">
        <div className="text-white">Loading...</div>
      </div>
    }>
      <LoginForm />
    </Suspense>
  )
}
