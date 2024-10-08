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
    <div className="min-h-screen bg-[#1c1c1c] text-white p-4">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-[#22c55e]">Go Store S3 Dashboard</h1>
          <Button variant="outline" onClick={handleLogout} className="border-[#22c55e] text-[#22c55e] hover:bg-[#22c55e] hover:text-white transition-colors duration-300">
            <LogOut className="mr-2 h-5 w-5" /> Logout
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Card className="bg-[#242424] border-[#2a2a2a] shadow-xl rounded-xl overflow-hidden">
              <CardHeader className="bg-[#1e1e1e]">
                <CardTitle className="text-2xl font-semibold text-white flex items-center">
                  <FileText className="mr-3 h-5 w-5 text-[#22c55e]" /> Stored Files
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <FileList refreshTrigger={refreshTrigger} searchParams={searchParams} onDelete={triggerRefresh} />
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">

            <Card className="bg-[#242424] border-[#2a2a2a] shadow-xl rounded-xl overflow-hidden">
              <CardHeader className="bg-[#1e1e1e] py-4">
                <CardTitle className="text-xl font-semibold text-white flex items-center">
                  <Upload className="mr-2 h-5 w-5 text-[#22c55e]" /> Upload File
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4">
                <FileUpload onUploadSuccess={triggerRefresh} />
              </CardContent>
            </Card>

            <Card className="bg-[#242424] border-[#2a2a2a] shadow-xl rounded-xl overflow-hidden">
              <CardHeader className="bg-[#1e1e1e] py-4">
                <CardTitle className="text-xl font-semibold text-white flex items-center">
                  <Search className="mr-2 h-5 w-5 text-[#22c55e]" /> Search Files
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4">
                <SearchFiles onSearch={handleSearch} />
              </CardContent>
            </Card>

            <Card className="bg-[#242424] border-[#2a2a2a] shadow-xl rounded-xl overflow-hidden">
              <CardHeader className="bg-[#1e1e1e] py-4">
                <CardTitle className="text-xl font-semibold text-white flex items-center">
                  <User className="mr-2 h-5 w-5 text-[#22c55e]" /> User Stats
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4">
                {isLoading ? (
                  <p className="text-gray-400">Loading user information...</p>
                ) : error ? (
                  <p className="text-red-400">{error}</p>
                ) : (
                  <div className="space-y-1 text-sm">
                    <p className="text-gray-300"><span className="font-semibold text-[#22c55e]">Email:</span> {userInfo.email}</p>
                    <p className="text-gray-300"><span className="font-semibold text-[#22c55e]">Total Files:</span> {userInfo.totalFiles}</p>
                    <p className="text-gray-300"><span className="font-semibold text-[#22c55e]">Storage Used:</span> {formatBytes(userInfo.storageUsed)}</p>
                  </div>
                )}
              </CardContent>
            </Card>
            
          </div>
        </div>
      </div>
    </div>
  )
}