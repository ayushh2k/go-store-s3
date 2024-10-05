// src/app/dashboard/DeleteDialog.tsx
import { useState } from 'react'
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Loader2 } from "lucide-react"
import { deleteFile } from '@/lib/api'

interface DeleteDialogProps {
  file: { ID: string; FileName: string } | null;
  onClose: () => void;
  onDelete: () => void;
}

export default function DeleteDialog({ file, onClose, onDelete }: DeleteDialogProps) {
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDeleteConfirm = async () => {
    if (file) {
      setIsDeleting(true)
      try {
        await deleteFile(file.ID)
        onDelete()
      } catch (error) {
        console.error('Failed to delete file:', error)
      } finally {
        setIsDeleting(false)
      }
    }
  }

  return (
    <Dialog open={!!file} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] bg-background bg-neutral-800 border-neutral-700">
        <DialogHeader>
          <DialogTitle>Confirm Deletion</DialogTitle>
          <DialogDescription className='text-white'>
            Are you sure you want to delete the file "{file?.FileName.split('/').pop()}"? This action cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={isDeleting}>Cancel</Button>
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
  )
}