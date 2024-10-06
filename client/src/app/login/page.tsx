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
import { LogIn, UserPlus, Loader2 } from 'lucide-react'

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
    <div className="flex justify-center items-center min-h-screen bg-[#1c1c1c] text-white p-4">
      <Card className="w-full max-w-md bg-[#242424] border-[#2a2a2a] shadow-2xl rounded-2xl overflow-hidden">
        <CardHeader className="text-center bg-[#1e1e1e] p-8">
          <LogIn className="h-20 w-20 text-[#22c55e] mx-auto mb-4" />
          <CardTitle className="text-4xl font-bold text-white mb-4">
            Login
          </CardTitle>
          <CardDescription className="text-xl text-gray-400">
            Enter your credentials
          </CardDescription>
        </CardHeader>
        <CardContent className="p-8">
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
                  className="bg-[#1e1e1e] text-white placeholder-gray-500 border-[#2a2a2a] focus:border-[#22c55e] transition-all duration-300"
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
                  className="bg-[#1e1e1e] text-white placeholder-gray-500 border-[#2a2a2a] focus:border-[#22c55e] transition-all duration-300"
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
        <CardFooter className="flex flex-col space-y-4 p-8 bg-[#1e1e1e]">
          <Button 
            onClick={handleSubmit} 
            disabled={isLoading} 
            size="lg" 
            className="w-full bg-[#22c55e] hover:bg-[#1ea34b] text-white transition-colors duration-300"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Logging in...
              </>
            ) : (
              <>
                <LogIn className="mr-2 h-5 w-5" /> 
                Login
              </>
            )}
          </Button>
          <Button asChild size="lg" variant="outline" className="w-full border-[#22c55e] text-[#22c55e] hover:bg-[#22c55e] hover:text-white transition-colors duration-300">
            <Link href="/register" className="flex items-center justify-center">
              <UserPlus className="mr-2 h-5 w-5" /> Register
            </Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}