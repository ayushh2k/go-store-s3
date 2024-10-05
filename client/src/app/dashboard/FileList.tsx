// src/app/dashboard/FileList.tsx
'use client'

import { useState, useEffect } from 'react'
import { Table, TableBody, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { fetchFiles } from '@/lib/api'
import { Alert, AlertDescription } from "@/components/ui/alert"
import FileRow from './FileRow'
import DeleteDialog from './DeleteDialog'
import ShareDialog from './ShareDialog'
import UpdateDialog from './UpdateDialog'
import { Loader2 } from 'lucide-react'

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
  searchParams: { fileName: string; uploadedAt: string; contentType: string } | null;
  onDelete: () => void;
}

export default function FileList({ refreshTrigger, searchParams, onDelete }: FileListProps) {
  const [files, setFiles] = useState<FileData[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [fileToDelete, setFileToDelete] = useState<FileData | null>(null)
  const [fileToShare, setFileToShare] = useState<FileData | null>(null)
  const [fileToUpdate, setFileToUpdate] = useState<FileData | null>(null)

  useEffect(() => {
    loadFiles()
  }, [refreshTrigger, searchParams])

  const loadFiles = async () => {
    setIsLoading(true)
    setError(null)
    try {
      let url = 'http://localhost:8080/files'
      if (searchParams) {
        const searchQuery = new URLSearchParams()
        if (searchParams.fileName) {
          searchQuery.append('file_name', searchParams.fileName)
        }
        if (searchParams.uploadedAt) {
          searchQuery.append('uploaded_at', searchParams.uploadedAt)
        }
        if (searchParams.contentType && searchParams.contentType !== 'all') {
          searchQuery.append('content_type', searchParams.contentType)
        }
        if (searchQuery.toString()) {
          url = `http://localhost:8080/search?${searchQuery.toString()}`
        }
      }
      const response: ApiResponse = await fetchFiles(url)
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

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-white" />
      </div>
    )
  }

  if (error) {
    return (
      <Alert variant="destructive" className="bg-red-500/20 border-red-500/50 text-white">
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    )
  }

  if (files.length === 0) {
    return (
      <Alert className="bg-blue-500/20 border-blue-500/50 text-white">
        <AlertDescription>
          No files found. {searchParams ? 'Try a different search.' : 'Upload a file to get started.'}
        </AlertDescription>
      </Alert>
    )
  }

  return (
    <div className="bg-white/10 backdrop-blur-lg rounded-lg overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="border-b border-white/20">
            <TableHead className="text-white">Name</TableHead>
            <TableHead className="text-white">Size</TableHead>
            <TableHead className="text-white">Type</TableHead>
            <TableHead className="text-white">Uploaded At</TableHead>
            <TableHead className="text-white">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {files.map((file) => (
            <FileRow
              key={file.ID}
              file={file}
              onDelete={() => setFileToDelete(file)}
              onShare={() => setFileToShare(file)}
              onUpdate={() => setFileToUpdate(file)}
            />
          ))}
        </TableBody>
      </Table>

      <DeleteDialog
        file={fileToDelete}
        onClose={() => setFileToDelete(null)}
        onDelete={async () => {
          await loadFiles()
          setFileToDelete(null)
          onDelete()
        }}
      />

      <ShareDialog
        file={fileToShare}
        onClose={() => setFileToShare(null)}
      />

      <UpdateDialog
        file={fileToUpdate}
        onClose={() => setFileToUpdate(null)}
        onUpdate={async () => {
          await loadFiles()
          setFileToUpdate(null)
        }}
      />
    </div>
  )
}