// src/app/dashboard/FileList.tsx
'use client'

import { useState, useEffect } from 'react'
import { Table, TableBody, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { fetchFiles, fetchUserInfo } from '@/lib/api'
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import FileRow from './FileRow'
import DeleteDialog from './DeleteDialog'
import ShareDialog from './ShareDialog'
import UpdateDialog from './UpdateDialog'
import { Loader2, ChevronLeft, ChevronRight } from 'lucide-react'

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

const ITEMS_PER_PAGE = 10;

export default function FileList({ refreshTrigger, searchParams, onDelete }: FileListProps) {
  const [files, setFiles] = useState<FileData[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [fileToDelete, setFileToDelete] = useState<FileData | null>(null)
  const [fileToShare, setFileToShare] = useState<FileData | null>(null)
  const [fileToUpdate, setFileToUpdate] = useState<FileData | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalFiles, setTotalFiles] = useState(0)

  useEffect(() => {
    loadUserInfo()
    loadFiles()
  }, [refreshTrigger, searchParams, currentPage])

  const loadUserInfo = async () => {
    try {
      const userInfo = await fetchUserInfo()
      setTotalFiles(userInfo.totalFiles)
    } catch (error) {
      console.error('Failed to fetch user info:', error)
    }
  }

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

  const totalPages = Math.ceil(totalFiles / ITEMS_PER_PAGE)

  const handlePreviousPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1))
  }

  const handleNextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages))
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-[#22c55e]" />
      </div>
    )
  }

  if (error) {
    return (
      <Alert variant="destructive" className="bg-red-500/20 border-red-500/50 text-red-400">
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    )
  }

  if (files.length === 0) {
    return (
      <Alert className="bg-[#22c55e]/20 border-[#22c55e]/50 text-[#22c55e]">
        <AlertDescription>
          No files found. {searchParams ? 'Try a different search.' : 'Upload a file to get started.'}
        </AlertDescription>
      </Alert>
    )
  }

  return (
    <div className="bg-[#242424] rounded-lg overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="border-b border-[#2a2a2a]">
            <TableHead className="text-[#22c55e]">Name</TableHead>
            <TableHead className="text-[#22c55e]">Size</TableHead>
            <TableHead className="text-[#22c55e]">Type</TableHead>
            <TableHead className="text-[#22c55e]">Uploaded At</TableHead>
            <TableHead className="text-[#22c55e]">Actions</TableHead>
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

      {/* Pagination Controls */}
      <div className="flex justify-between items-center mt-4 px-4 py-2 border-t border-[#2a2a2a]">
        <div className="text-gray-400">
          Showing {(currentPage - 1) * ITEMS_PER_PAGE + 1} to {Math.min(currentPage * ITEMS_PER_PAGE, totalFiles)} of {totalFiles} files
        </div>
        <div className="flex space-x-2">
          <Button
            onClick={handlePreviousPage}
            disabled={currentPage === 1}
            className="bg-[#22c55e] hover:bg-[#1ea34b] text-white"
          >
            <ChevronLeft className="h-4 w-4 mr-2" /> Previous
          </Button>
          <Button
            onClick={handleNextPage}
            disabled={currentPage === totalPages}
            className="bg-[#22c55e] hover:bg-[#1ea34b] text-white"
          >
            Next <ChevronRight className="h-4 w-4 ml-2" />
          </Button>
        </div>
      </div>

      <DeleteDialog
        file={fileToDelete}
        onClose={() => setFileToDelete(null)}
        onDelete={async () => {
          await loadFiles()
          await loadUserInfo()
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