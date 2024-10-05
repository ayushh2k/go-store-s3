// src/app/dashboard/page.tsx
'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import FileList from './FileList'
import FileUpload from './FileUpload'
import SearchFiles from './SearchFiles'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { LogOut, Upload, Search, FileText, User } from 'lucide-react'

export default function DashboardContent() {
  const router = useRouter()
  const [refreshTrigger, setRefreshTrigger] = useState(0)
  const [searchParams, setSearchParams] = useState<{ fileName: string; uploadedAt: string; contentType: string } | null>(null)

  const handleLogout = () => {
    localStorage.removeItem('token')
    router.push('/login')
  }

  const triggerRefresh = () => {
    setRefreshTrigger(prev => prev + 1)
    setSearchParams(null)
  }

  const handleSearch = (fileName: string, uploadedAt: string, contentType: string) => {
    if (fileName === '' && uploadedAt === '' && contentType === '') {
      setSearchParams(null)
    } else {
      setSearchParams({ fileName, uploadedAt, contentType })
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-cyan-700 to-teal-700">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-white">Go Store S3 Dashboard</h1>
          <Button variant="outline" onClick={handleLogout} className="border-white text-white hover:bg-white/20">
            <LogOut className="mr-2 h-5 w-5" /> Logout
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="col-span-1 md:col-span-2 backdrop-blur-lg bg-white/20 border-white/50 shadow-xl">
            <CardHeader>
              <CardTitle className="text-xl font-semibold text-white flex items-center">
                <FileText className="mr-2 h-6 w-6" /> Stored Files
              </CardTitle>
            </CardHeader>
            <CardContent>
              <FileList refreshTrigger={refreshTrigger} searchParams={searchParams} />
            </CardContent>
          </Card>

          <div className="space-y-6">

            <Card className="backdrop-blur-lg bg-white/20 border-white/50 shadow-xl">
              <CardHeader>
                <CardTitle className="text-xl font-semibold text-white flex items-center">
                  <User className="mr-2 h-6 w-6" /> User Stats
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-white">Total Files: 42</p>
                <p className="text-white">Storage Used: 1.2 GB</p>
              </CardContent>
            </Card>
            
            <Card className="backdrop-blur-lg bg-white/20 border-white/50 shadow-xl">
              <CardHeader>
                <CardTitle className="text-xl font-semibold text-white flex items-center">
                  <Upload className="mr-2 h-6 w-6" /> Upload File
                </CardTitle>
              </CardHeader>
              <CardContent>
                <FileUpload onUploadSuccess={triggerRefresh} />
              </CardContent>
            </Card>

            <Card className="backdrop-blur-lg bg-white/20 border-white/50 shadow-xl">
              <CardHeader>
                <CardTitle className="text-xl font-semibold text-white flex items-center">
                  <Search className="mr-2 h-6 w-6" /> Search Files
                </CardTitle>
              </CardHeader>
              <CardContent>
                <SearchFiles onSearch={handleSearch} />
              </CardContent>
            </Card>

          </div>
        </div>
      </div>
    </div>
  )
}