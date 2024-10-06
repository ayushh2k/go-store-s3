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
import { Loader2, AlertTriangle } from "lucide-react"
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
        onClose()
      }
    }
  }

  return (
    <Dialog open={!!file} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] bg-[#242424] text-white border border-[#2a2a2a] shadow-lg">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold flex items-center">
            <AlertTriangle className="w-6 h-6 text-yellow-500 mr-2" />
            Confirm Deletion
          </DialogTitle>
          <DialogDescription className='text-gray-400 mt-2'>
            Are you sure you want to delete the file "{file?.FileName.split('/').pop()}"? This action cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="mt-6 space-x-2">
          <Button 
            variant="outline" 
            onClick={onClose} 
            disabled={isDeleting}
            className="bg-transparent border-[#22c55e] text-[#22c55e] hover:bg-[#22c55e]/20"
          >
            Cancel
          </Button>
          <Button 
            variant="destructive" 
            onClick={handleDeleteConfirm} 
            disabled={isDeleting}
            className="bg-red-500 hover:bg-red-600 text-white"
          >
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