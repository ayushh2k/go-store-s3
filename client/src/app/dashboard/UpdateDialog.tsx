// src/app/dashboard/UpdateDialog.tsx
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
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Loader2 } from "lucide-react"
import { updateFile } from '@/lib/api'

interface UpdateDialogProps {
  file: { ID: string; FileName: string } | null;
  onClose: () => void;
  onUpdate: () => void;
}

export default function UpdateDialog({ file, onClose, onUpdate }: UpdateDialogProps) {
  const [newFileName, setNewFileName] = useState('')
  const [isUpdating, setIsUpdating] = useState(false)

  const handleUpdateConfirm = async () => {
    if (file) {
      setIsUpdating(true)
      try {
        await updateFile(file.ID, { file_name: newFileName })
        onUpdate()
      } catch (error) {
        console.error('Failed to update file:', error)
      } finally {
        setIsUpdating(false)
      }
    }
  }

  return (
    <Dialog open={!!file} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] bg-background bg-neutral-800 border-neutral-700">
        <DialogHeader>
          <DialogTitle>Update File Name</DialogTitle>
          <DialogDescription className='text-white'>
            Enter a new name for the file "{file?.FileName.split('/').pop()}".
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              New Name
            </Label>
            <Input
              id="name"
              value={newFileName}
              onChange={(e) => setNewFileName(e.target.value)}
              className="col-span-3"
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={isUpdating}>Cancel</Button>
          <Button onClick={handleUpdateConfirm} disabled={isUpdating}>
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