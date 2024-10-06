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
          className="w-full text-[#22c55e] border-[#22c55e] hover:bg-[#22c55e] hover:text-white transition-all duration-300"
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
          <div className="text-sm text-gray-400 truncate">
            Selected: {file.name}
          </div>
        )}
      </div>
      <Button 
        onClick={handleUpload} 
        disabled={!file || isUploading}
        className="w-full bg-[#22c55e] text-white hover:bg-[#1ea34b] transition-all duration-300"
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
            ? "bg-[#22c55e]/20 border-[#22c55e]/50 text-[#22c55e]" 
            : "bg-red-500/20 border-red-500/50 text-red-400"}
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