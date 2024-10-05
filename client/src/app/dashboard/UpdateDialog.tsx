// src/app/dashboard/UpdateDialog.tsx
import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Loader2, Edit2 } from "lucide-react"
import { updateFile } from '@/lib/api'

interface UpdateDialogProps {
  file: { ID: string; FileName: string } | null;
  onClose: () => void;
  onUpdate: () => void;
}

export default function UpdateDialog({ file, onClose, onUpdate }: UpdateDialogProps) {
  const [newFileName, setNewFileName] = useState('')
  const [isUpdating, setIsUpdating] = useState(false)

  useEffect(() => {
    if (file) {
      setNewFileName(file.FileName.split('/').pop() || '')
    }
  }, [file])

  const handleUpdateConfirm = async () => {
    if (file && newFileName.trim() !== '') {
      setIsUpdating(true)
      try {
        await updateFile(file.ID, { file_name: newFileName.trim() })
        onUpdate()
        onClose()
      } catch (error) {
        console.error('Failed to update file:', error)
      } finally {
        setIsUpdating(false)
      }
    }
  }

  return (
    <Dialog open={!!file} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] bg-gradient-to-br from-blue-800 via-indigo-900 to-purple-900 text-white border border-white/20 shadow-lg">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold flex items-center">
            <Edit2 className="w-6 h-6 text-blue-400 mr-2" />
            Update File Name
          </DialogTitle>
          <DialogDescription className='text-white/80 mt-2'>
            Enter a new name for the file "{file?.FileName.split('/').pop()}".
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right text-white">
              New Name
            </Label>
            <Input
              id="name"
              value={newFileName}
              onChange={(e) => setNewFileName(e.target.value)}
              className="col-span-3 bg-white/20 border-white/30 text-white placeholder-white/50 focus:border-white/60"
            />
          </div>
        </div>
        <DialogFooter className="space-x-2">
          <Button 
            variant="outline" 
            onClick={onClose} 
            disabled={isUpdating}
            className="bg-transparent border-white/30 text-white hover:bg-white/20"
          >
            Cancel
          </Button>
          <Button 
            onClick={handleUpdateConfirm} 
            disabled={isUpdating || newFileName.trim() === ''}
            className="bg-blue-500 hover:bg-blue-600 text-white"
          >
            {isUpdating ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Updating...
              </>
            ) : (
              'Update'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}