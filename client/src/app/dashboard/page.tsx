// src/app/dashboard/page.tsx
'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import FileList from './FileList'
import FileUpload from './FileUpload'
import SearchFiles from './SearchFiles'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { LogOut, Upload, Search, FileText, User } from 'lucide-react'
import { fetchUserInfo } from '@/lib/api'

export default function DashboardContent() {
  const router = useRouter()
  const [refreshTrigger, setRefreshTrigger] = useState(0)
  const [searchParams, setSearchParams] = useState<{ fileName: string; uploadedAt: string; contentType: string } | null>(null)
  const [userInfo, setUserInfo] = useState({
    email: '',
    totalFiles: 0,
    storageUsed: 0,
  })
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const getUserInfo = async () => {
      setIsLoading(true)
      setError(null)
      try {
        const info = await fetchUserInfo()
        setUserInfo(info)
      } catch (error) {
        console.error('Failed to fetch user info:', error)
        setError('Failed to load user information. Please try again later.')
      } finally {
        setIsLoading(false)
      }
    }

    getUserInfo()
  }, [refreshTrigger])

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

  const formatBytes = (bytes: number, decimals = 2) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-800 via-indigo-900 to-purple-900 text-white">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-white">Go Store S3 Dashboard</h1>
          <Button variant="outline" onClick={handleLogout} className="border-white text-white hover:bg-white/20 transition-all duration-300">
            <LogOut className="mr-2 h-5 w-5" /> Logout
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <Card className="col-span-1 lg:col-span-2 backdrop-blur-lg bg-white/10 border-white/20 shadow-xl rounded-xl overflow-hidden">
            <CardHeader className="bg-white/5">
              <CardTitle className="text-2xl font-semibold text-white flex items-center">
                <FileText className="mr-3 h-7 w-7" /> Stored Files
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <FileList refreshTrigger={refreshTrigger} searchParams={searchParams} onDelete={triggerRefresh} />
            </CardContent>
          </Card>

          <div className="space-y-8">
            <Card className="backdrop-blur-lg bg-white/10 border-white/20 shadow-xl rounded-xl overflow-hidden">
              <CardHeader className="bg-white/5">
                <CardTitle className="text-2xl font-semibold text-white flex items-center">
                  <User className="mr-3 h-7 w-7" /> User Stats
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                {isLoading ? (
                  <p className="text-white/80">Loading user information...</p>
                ) : error ? (
                  <p className="text-red-300">{error}</p>
                ) : (
                  <div className="space-y-2">
                    <p className="text-white/90"><span className="font-semibold">Email:</span> {userInfo.email}</p>
                    <p className="text-white/90"><span className="font-semibold">Total Files:</span> {userInfo.totalFiles}</p>
                    <p className="text-white/90"><span className="font-semibold">Storage Used:</span> {formatBytes(userInfo.storageUsed)}</p>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className="backdrop-blur-lg bg-white/10 border-white/20 shadow-xl rounded-xl overflow-hidden">
              <CardHeader className="bg-white/5">
                <CardTitle className="text-2xl font-semibold text-white flex items-center">
                  <Upload className="mr-3 h-7 w-7" /> Upload File
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <FileUpload onUploadSuccess={triggerRefresh} />
              </CardContent>
            </Card>

            <Card className="backdrop-blur-lg bg-white/10 border-white/20 shadow-xl rounded-xl overflow-hidden">
              <CardHeader className="bg-white/5">
                <CardTitle className="text-2xl font-semibold text-white flex items-center">
                  <Search className="mr-3 h-7 w-7" /> Search Files
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <SearchFiles onSearch={handleSearch} />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}