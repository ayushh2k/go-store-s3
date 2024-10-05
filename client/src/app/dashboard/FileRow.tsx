// src/app/dashboard/FileRow.tsx
import { TableCell, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Edit, Share, Trash2 } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

interface FileData {
  ID: string;
  FileName: string;
  FileSize: number;
  ContentType: string;
  UploadedAt: string;
}

interface FileRowProps {
  file: FileData;
  onDelete: () => void;
  onShare: () => void;
  onUpdate: () => void;
}

export default function FileRow({ file, onDelete, onShare, onUpdate }: FileRowProps) {

  const getFileExtension = (fileName: string) => {
    return fileName.split('.').pop() || '';
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: '2-digit', month: '2-digit', day: '2-digit' });
  };

  return (
    <TableRow className="border-b border-white/10 hover:bg-white/5">
      <TableCell className="font-medium text-white">
        {file.FileName.split('/').pop()}
      </TableCell>
      <TableCell className="text-white/80">{(file.FileSize / 1024 / 1024).toFixed(2)} MB</TableCell>
      <TableCell className="text-white/80">{getFileExtension(file.FileName).toUpperCase()}</TableCell>
      <TableCell className="text-white/80">{formatDate(file.UploadedAt)}</TableCell>
      <TableCell>
        <div className="flex space-x-2">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline" size="icon" onClick={onShare} className="text-white border-white/20 hover:bg-white/20">
                  <Share className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Share</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline" size="icon" onClick={onUpdate} className="text-white border-white/20 hover:bg-white/20">
                  <Edit className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Edit</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline" size="icon" onClick={onDelete} className="text-red-500 border-red-500/20 hover:bg-red-500/20">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Delete</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </TableCell>
    </TableRow>
  )
}