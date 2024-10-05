import Link from 'next/link'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { LogIn, UserPlus, CloudUpload, Zap, Lock, Search } from 'lucide-react'

export default function Home() {
  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-blue-600 via-cyan-700 to-teal-700 animate-gradient-x">
      <Card className="w-[600px] backdrop-blur-lg bg-white/20 border-white/50 shadow-xl transform transition-transform duration-300 hover:scale-105">
        <CardHeader className="text-center">
          <CardTitle className="text-4xl font-bold text-white mb-4 animate-pulse">
            <CloudUpload className="inline-block mr-2 h-10 w-10" /> Go Store S3
          </CardTitle>
          <CardDescription className="text-xl text-white/80">
            Manage Files with Ease on S3.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4 text-white">
            <p className="text-center text-xl font-semibold">
              Get started with powerful features:
            </p>
            <ul className="space-y-2">
              <li className="flex items-center">
                <Zap className="mr-2 h-6 w-6 text-blue-300" />
                Intelligent caching for instant access to frequent files
              </li>
              <li className="flex items-center">
                <Lock className="mr-2 h-6 w-6 text-blue-300" />
                Secure pre-signed share links
              </li>
              <li className="flex items-center">
                <Search className="mr-2 h-6 w-6 text-blue-300" />
                Efficient search with smart filtering for quick retrieval
              </li>
            </ul>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button asChild size="lg" className="w-[45%] bg-white text-blue-600 hover:bg-blue-100 transition-all duration-300 transform hover:scale-105">
            <Link href="/login" className="flex items-center justify-center">
              <LogIn className="mr-2 h-6 w-6" /> Login
            </Link>
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