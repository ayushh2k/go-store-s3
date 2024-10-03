// src/app/dashboard/FileList.tsx
'use client'

import { useState, useEffect } from 'react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { fetchFiles, deleteFile, shareFile } from '@/lib/api'
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Loader2, Copy, Check } from "lucide-react"
import { Input } from "@/components/ui/input"

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
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [shareDialogOpen, setShareDialogOpen] = useState(false)
  const [fileToDelete, setFileToDelete] = useState<FileData | null>(null)
  const [shareLink, setShareLink] = useState<string>('')
  const [isDeleting, setIsDeleting] = useState(false)
  const [isSharing, setIsSharing] = useState(false)
  const [isCopied, setIsCopied] = useState(false)

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

  const handleDeleteClick = (file: FileData) => {
    setFileToDelete(file)
    setDeleteDialogOpen(true)
  }

  const handleDeleteConfirm = async () => {
    if (fileToDelete) {
      setIsDeleting(true)
      try {
        await deleteFile(fileToDelete.ID)
        setDeleteDialogOpen(false)
        await loadFiles()
      } catch (error) {
        console.error('Failed to delete file:', error)
        setError('Failed to delete file. Please try again.')
      } finally {
        setIsDeleting(false)
      }
    }
  }

  const handleShare = async (fileId: string) => {
    setIsSharing(true)
    try {
      const link = await shareFile(fileId)
      setShareLink(`http://localhost:8080/share/${link}`)
      setShareDialogOpen(true)
    } catch (error) {
      console.error('Failed to share file:', error)
      setError('Failed to share file. Please try again.')
    } finally {
      setIsSharing(false)
    }
  }

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shareLink)
      setIsCopied(true)
      setTimeout(() => setIsCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy: ', err)
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
            <TableRow key={file.ID}>
              <TableCell>{file.FileName.split('/').pop()}</TableCell>
              <TableCell>{(file.FileSize / 1024 / 1024).toFixed(2)} MB</TableCell>
              <TableCell>{file.ContentType}</TableCell>
              <TableCell>{new Date(file.UploadedAt).toLocaleString()}</TableCell>
              <TableCell>
                <Button variant="outline" size="sm" onClick={() => handleShare(file.ID)} disabled={isSharing}>
                  {isSharing ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Share'}
                </Button>
                <Button variant="destructive" size="sm" onClick={() => handleDeleteClick(file)}>Delete</Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[425px] bg-background bg-neutral-800 border-neutral-700">
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription className='text-white'>
              Are you sure you want to delete the file "{fileToDelete?.FileName.split('/').pop()}"? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)} disabled={isDeleting}>Cancel</Button>
            <Button variant="destructive" onClick={handleDeleteConfirm} disabled={isDeleting}>
              {isDeleting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                'Delete'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={shareDialogOpen} onOpenChange={setShareDialogOpen}>
        <DialogContent className="sm:max-w-[425px] bg-background bg-neutral-800 border-neutral-700">
          <DialogHeader>
            <DialogTitle>Share File</DialogTitle>
            <DialogDescription className='text-white'>
              Copy the link below to share your file:
            </DialogDescription>
          </DialogHeader>
          <div className="flex items-center space-x-2">
            <Input
              readOnly
              value={shareLink}
              className="flex-1"
            />
            <Button size="sm" onClick={handleCopy}>
              {isCopied ? (
                <Check className="h-4 w-4" />
              ) : (
                <Copy className="h-4 w-4" />
              )}
            </Button>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShareDialogOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}