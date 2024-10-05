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
}

export default function FileList({ refreshTrigger, searchParams }: FileListProps) {
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
          No files found. {searchParams ? 'Try a different search.' : 'Upload a file to get started.'}
        </AlertDescription>
      </Alert>
    )
  }

  return (
    <>
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
    </>
  )
}