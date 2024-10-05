// src/app/dashboard/ShareDialog.tsx
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
import { Loader2, Copy, Check } from "lucide-react"
import { shareFile } from '@/lib/api'

interface ShareDialogProps {
  file: { ID: string; FileName: string } | null;
  onClose: () => void;
}

export default function ShareDialog({ file, onClose }: ShareDialogProps) {
  const [isSharing, setIsSharing] = useState(false)
  const [shareLink, setShareLink] = useState('')
  const [shareExpiry, setShareExpiry] = useState('')
  const [isCopied, setIsCopied] = useState(false)

  const handleShare = async () => {
    if (file) {
      setIsSharing(true)
      try {
        const response = await shareFile(file.ID)
        setShareLink(response.public_url)
        setShareExpiry(new Date(response.expires_at).toLocaleString())
      } catch (error) {
        console.error('Failed to share file:', error)
      } finally {
        setIsSharing(false)
      }
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

  return (
    <Dialog open={!!file} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] bg-background bg-neutral-800 border-neutral-700">
        <DialogHeader>
          <DialogTitle>Share File</DialogTitle>
          <DialogDescription className='text-white'>
            {shareLink ? `Copy the link below to share your file. This link expires on ${shareExpiry}.` : 'Generate a share link for your file.'}
          </DialogDescription>
        </DialogHeader>
        {!shareLink && (
          <Button onClick={handleShare} disabled={isSharing}>
            {isSharing ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Generating link...
              </>
            ) : (
              'Generate Share Link'
            )}
          </Button>
        )}
        {shareLink && (
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
        )}
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}