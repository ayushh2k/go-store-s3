// src/app/dashboard/page.tsx
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import FileList from './FileList'
import FileUpload from './FileUpload'
import SearchFiles from './SearchFiles'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export default function DashboardContent() {
  const router = useRouter()
  const [refreshTrigger, setRefreshTrigger] = useState(0)

  const handleLogout = () => {
    localStorage.removeItem('token')
    router.push('/login')
  }

  const triggerRefresh = () => {
    setRefreshTrigger(prev => prev + 1)
  }

  return (
    <div className="container mx-auto p-4">
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Dashboard</CardTitle>
          <CardDescription>Manage your files</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <FileUpload onUploadSuccess={triggerRefresh} />
            <SearchFiles />
            <FileList refreshTrigger={refreshTrigger} />
          </div>
        </CardContent>
        <CardFooter>
          <Button variant="outline" onClick={handleLogout}>Logout</Button>
        </CardFooter>
      </Card>
    </div>
  )
}