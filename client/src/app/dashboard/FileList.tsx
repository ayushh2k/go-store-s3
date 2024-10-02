// src/app/dashboard/FileList.tsx
'use client'

import { useState, useEffect } from 'react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { fetchFiles, deleteFile, shareFile } from '@/lib/api'
import { Alert, AlertDescription } from "@/components/ui/alert"

interface FileData {
  ID: string;
  FileName: string;
  FileURL: string;
  FileSize: number;
  ContentType: string;
  UploadedAt: string;
  UserID: string;
  ExpiresAt: string | null;
}

interface ApiResponse {
  files: FileData[];
}

interface FileListProps {
  refreshTrigger: number;
}

export default function FileList({ refreshTrigger }: FileListProps) {
  const [files, setFiles] = useState<FileData[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadFiles()
  }, [refreshTrigger])  // Add refreshTrigger to the dependency array

  const loadFiles = async () => {
    setIsLoading(true)
    setError(null)
    try {
      const response: ApiResponse = await fetchFiles()
      if (Array.isArray(response.files)) {
        setFiles(response.files)
      } else {
        throw new Error('Fetched data is not in the expected format')
      }
    } catch (error) {
      console.error('Failed to fetch files:', error)
      setError('Failed to load files. Please try again later.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async (fileId: string) => {
    try {
      await deleteFile(fileId)
      await loadFiles()
    } catch (error) {
      console.error('Failed to delete file:', error)
      setError('Failed to delete file. Please try again.')
    }
  }

  const handleShare = async (fileId: string) => {
    try {
      const shareLink = await shareFile(fileId)
      alert(`Share link: ${shareLink}`)
    } catch (error) {
      console.error('Failed to share file:', error)
      setError('Failed to share file. Please try again.')
    }
  }

  if (isLoading) {
    return <div>Loading files...</div>
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    )
  }

  if (files.length === 0) {
    return (
      <Alert>
        <AlertDescription>
          No files found. Upload a file to get started.
        </AlertDescription>
      </Alert>
    )
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Size</TableHead>
          <TableHead>Type</TableHead>
          <TableHead>Uploaded At</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {files.map((file) => (
          <TableRow key={file.ID}>
            <TableCell>{file.FileName.split('/').pop()}</TableCell>
            <TableCell>{(file.FileSize / 1024 / 1024).toFixed(2)} MB</TableCell>
            <TableCell>{file.ContentType}</TableCell>
            <TableCell>{new Date(file.UploadedAt).toLocaleString()}</TableCell>
            <TableCell>
              <Button variant="outline" size="sm" onClick={() => handleShare(file.ID)}>Share</Button>
              <Button variant="destructive" size="sm" onClick={() => handleDelete(file.ID)}>Delete</Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}