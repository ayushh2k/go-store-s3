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
      <DialogContent className="sm:max-w-[425px] bg-[#242424] text-white border border-[#2a2a2a] shadow-lg">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold flex items-center">
            <Edit2 className="w-6 h-6 text-[#22c55e] mr-2" />
            Update File Name
          </DialogTitle>
          <DialogDescription className='text-gray-400 mt-2'>
            Enter a new name for the file "{file?.FileName.split('/').pop()}".
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right text-gray-300">
              New Name
            </Label>
            <Input
              id="name"
              value={newFileName}
              onChange={(e) => setNewFileName(e.target.value)}
              className="col-span-3 bg-[#1e1e1e] border-[#2a2a2a] text-white placeholder-gray-500 focus:border-[#22c55e]"
            />
          </div>
        </div>
        <DialogFooter className="space-x-2">
          <Button 
            variant="outline" 
            onClick={onClose} 
            disabled={isUpdating}
            className="bg-transparent border-[#22c55e] text-[#22c55e] hover:bg-[#22c55e]/20"
          >
            Cancel
          </Button>
          <Button 
            onClick={handleUpdateConfirm} 
            disabled={isUpdating || newFileName.trim() === ''}
            className="bg-[#22c55e] hover:bg-[#1ea34b] text-white"
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