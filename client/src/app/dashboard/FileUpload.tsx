// src/app/dashboard/FileUpload.tsx
'use client'

import { useState, useRef } from 'react'
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Loader2, Upload, File } from "lucide-react"
import { uploadFile } from '@/lib/api'

interface FileUploadProps {
  onUploadSuccess: () => void;
}

export default function FileUpload({ onUploadSuccess }: FileUploadProps) {
  const [file, setFile] = useState<File | null>(null)
  const [uploadStatus, setUploadStatus] = useState<string | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

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
      if (fileInputRef.current) fileInputRef.current.value = ''
    } catch (error) {
      console.error('Upload failed:', error)
      setUploadStatus('File upload failed. Please try again.')
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <Button
          onClick={() => fileInputRef.current?.click()}
          variant="outline"
          className="w-full text-white border-white/30 hover:bg-white/20 transition-all duration-300"
        >
          <File className="mr-2 h-5 w-5" />
          {file ? 'Change File' : 'Choose File'}
        </Button>
        <input
          ref={fileInputRef}
          type="file"
          onChange={handleFileChange}
          className="hidden"
        />
        {file && (
          <div className="text-sm text-white/80 truncate">
            Selected: {file.name}
          </div>
        )}
      </div>
      <Button 
        onClick={handleUpload} 
        disabled={!file || isUploading}
        className="w-full bg-white text-blue-800 hover:bg-blue-100 transition-all duration-300 transform hover:scale-105"
      >
        {isUploading ? (
          <>
            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
            Uploading...
          </>
        ) : (
          <>
            <Upload className="mr-2 h-5 w-5" />
            Upload
          </>
        )}
      </Button>
      {uploadStatus && (
        <Alert 
          variant={uploadStatus.includes('success') ? 'default' : 'destructive'}
          className={uploadStatus.includes('success') 
            ? "bg-green-500/20 border-green-500/50 text-white" 
            : "bg-red-500/20 border-red-500/50 text-white"}
        >
          <AlertTitle className="font-semibold">
            {uploadStatus.includes('success') ? 'Success' : 'Error'}
          </AlertTitle>
          <AlertDescription>{uploadStatus}</AlertDescription>
        </Alert>
      )}
    </div>
  )
}