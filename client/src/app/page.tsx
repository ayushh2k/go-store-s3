import Link from 'next/link'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { LogIn, UserPlus, CloudUpload, Zap, Lock, Search } from 'lucide-react'

export default function Home() {
  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-blue-800 via-indigo-900 to-purple-900 text-white">
      <Card className="w-[600px] backdrop-blur-lg bg-white/10 border-white/20 shadow-xl rounded-xl overflow-hidden">
        <CardHeader className="text-center bg-white/5 pb-8">
          <CardTitle className="text-5xl font-bold text-white mb-4">
            <CloudUpload className="inline-block mr-3 h-12 w-12" /> Go Store S3
          </CardTitle>
          <CardDescription className="text-2xl text-white/80">
            Manage Files with Ease on S3
          </CardDescription>
        </CardHeader>
        <CardContent className="p-8">
          <div className="space-y-6 text-white">
            <p className="text-center text-2xl font-semibold">
              Get started with powerful features:
            </p>
            <ul className="space-y-4">
              <li className="flex items-center text-lg">
                <Zap className="mr-3 h-7 w-7 text-blue-300" />
                Intelligent caching for instant access to frequent files
              </li>
              <li className="flex items-center text-lg">
                <Lock className="mr-3 h-7 w-7 text-blue-300" />
                Secure pre-signed share links
              </li>
              <li className="flex items-center text-lg">
                <Search className="mr-3 h-7 w-7 text-blue-300" />
                Efficient search with smart filtering for quick retrieval
              </li>
            </ul>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between p-8 bg-white/5">
          <Button asChild size="lg" className="w-[45%] bg-white text-blue-800 hover:bg-blue-100 transition-all duration-300 transform hover:scale-105">
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