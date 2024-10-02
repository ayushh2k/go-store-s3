// src/app/dashboard/FileUpload.tsx
'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Loader2 } from "lucide-react"
import { uploadFile } from '@/lib/api'

interface FileUploadProps {
  onUploadSuccess: () => void;
}

export default function FileUpload({ onUploadSuccess }: FileUploadProps) {
  const [file, setFile] = useState<File | null>(null)
  const [uploadStatus, setUploadStatus] = useState<string | null>(null)
  const [isUploading, setIsUploading] = useState(false)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0])
      setUploadStatus(null)
    }
  }

  const handleUpload = async () => {
    if (!file) return

    setIsUploading(true)
    setUploadStatus(null)

    try {
      await uploadFile(file)
      setUploadStatus('File uploaded successfully!')
      onUploadSuccess()
      setFile(null)
    } catch (error) {
      console.error('Upload failed:', error)
      setUploadStatus('File upload failed. Please try again.')
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="file">Upload File</Label>
        <Input 
          id="file" 
          type="file" 
          onChange={handleFileChange} 
          disabled={isUploading}
        />
      </div>
      <Button 
        onClick={handleUpload} 
        disabled={!file || isUploading}
        className="w-full"
      >
        {isUploading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Uploading...
          </>
        ) : (
          'Upload'
        )}
      </Button>
      {uploadStatus && (
        <Alert variant={uploadStatus.includes('success') ? 'default' : 'destructive'}>
          <AlertTitle>Upload Status</AlertTitle>
          <AlertDescription>{uploadStatus}</AlertDescription>
        </Alert>
      )}
    </div>
  )
}