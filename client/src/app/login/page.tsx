// src/app/login/page.tsx
'use client'

import Link from 'next/link'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { LogIn, UserPlus } from 'lucide-react'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    try {
      const response = await fetch('http://localhost:8080/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })

      if (response.ok) {
        const data = await response.json()
        localStorage.setItem('token', data.token)
        router.push('/dashboard')
      } else {
        const data = await response.json()
        setError(data.message || 'Login failed')
      }
    } catch (err) {
      setError('An error occurred. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-blue-800 via-indigo-900 to-purple-900 text-white">
      <Card className="w-[400px] backdrop-blur-lg bg-white/10 border-white/20 shadow-xl rounded-xl overflow-hidden">
        <CardHeader className="text-center bg-white/5 pb-8">
          <CardTitle className="text-4xl font-bold text-white mb-4">
            <LogIn className="inline-block mr-3 h-10 w-10" /> Login
          </CardTitle>
          <CardDescription className="text-white/80 text-xl">
            Enter your credentials
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <form onSubmit={handleSubmit}>
            <div className="grid w-full items-center gap-6">
              <div className="flex flex-col space-y-2">
                <Label htmlFor="email" className="text-white text-lg">Email</Label>
                <Input 
                  id="email" 
                  type="email" 
                  placeholder="Enter your email" 
                  value={email} 
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isLoading}
                  className="bg-white/20 text-white placeholder-white/50 border-white/30 focus:border-white/60 transition-all duration-300"
                />
              </div>
              <div className="flex flex-col space-y-2">
                <Label htmlFor="password" className="text-white text-lg">Password</Label>
                <Input 
                  id="password" 
                  type="password" 
                  placeholder="Enter your password" 
                  value={password} 
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={isLoading}
                  className="bg-white/20 text-white placeholder-white/50 border-white/30 focus:border-white/60 transition-all duration-300"
                />
              </div>
            </div>
          </form>
          {error && (
            <Alert variant="destructive" className="mt-6 bg-red-500/20 border-red-500/50">
              <AlertTitle className="text-white font-semibold">Error</AlertTitle>
              <AlertDescription className="text-white/90">{error}</AlertDescription>
            </Alert>
          )}
        </CardContent>
        <CardFooter className="flex justify-between p-6 bg-white/5">
          <Button onClick={handleSubmit} disabled={isLoading} size="lg" className="w-[45%] bg-white text-blue-800 hover:bg-blue-100 transition-all duration-300 transform hover:scale-105">
            <LogIn className="mr-2 h-6 w-6" /> {isLoading ? 'Logging in...' : 'Login'}
          </Button>
          <Button asChild size="lg" variant="outline" className="w-[45%] border-white text-white hover:bg-white/20 transition-all duration-300 transform hover:scale-105">
            <Link href="/register" className="flex items-center justify-center">
              <UserPlus className="mr-2 h-6 w-6" /> Register
            </Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}