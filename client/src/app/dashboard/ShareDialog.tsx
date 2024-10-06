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
import { Loader2, Copy, Check, Share2 } from "lucide-react"
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
      <DialogContent className="sm:max-w-[425px] bg-[#242424] text-white border border-[#2a2a2a] shadow-lg">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold flex items-center">
            <Share2 className="w-6 h-6 text-[#22c55e] mr-2" />
            Share File
          </DialogTitle>
          <DialogDescription className='text-gray-400 mt-2'>
            {shareLink 
              ? `Copy the link below to share your file. This link expires on ${shareExpiry}.` 
              : 'Generate a share link for your file.'}
          </DialogDescription>
        </DialogHeader>
        <div className="my-4">
          {!shareLink && (
            <Button 
              onClick={handleShare} 
              disabled={isSharing}
              className="w-full bg-[#22c55e] hover:bg-[#1ea34b] text-white"
            >
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
                className="flex-1 bg-[#1e1e1e] border-[#2a2a2a] text-white placeholder-gray-500"
              />
              <Button 
                size="sm" 
                onClick={handleCopy}
                className={`${isCopied ? 'bg-green-500' : 'bg-[#22c55e]'} hover:bg-opacity-80 text-white`}
              >
                {isCopied ? (
                  <Check className="h-4 w-4" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </Button>
            </div>
          )}
        </div>
        <DialogFooter>
          <Button 
            variant="outline" 
            onClick={onClose}
            className="bg-transparent border-[#22c55e] text-[#22c55e] hover:bg-[#22c55e]/20"
          >
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}