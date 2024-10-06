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
    <TableRow className="border-b border-[#2a2a2a] hover:bg-[#2a2a2a]/50">
      <TableCell className="font-medium text-white">
        {file.FileName.split('/').pop()}
      </TableCell>
      <TableCell className="text-gray-400">{(file.FileSize / 1024 / 1024).toFixed(2)} MB</TableCell>
      <TableCell className="text-gray-400">{getFileExtension(file.FileName).toUpperCase()}</TableCell>
      <TableCell className="text-gray-400">{formatDate(file.UploadedAt)}</TableCell>
      <TableCell>
        <div className="flex space-x-2">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  variant="outline" 
                  size="icon" 
                  onClick={onShare} 
                  className="text-[#22c55e] border-[#22c55e] hover:bg-[#22c55e]/20"
                >
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
                <Button 
                  variant="outline" 
                  size="icon" 
                  onClick={onUpdate} 
                  className="text-[#22c55e] border-[#22c55e] hover:bg-[#22c55e]/20"
                >
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
                <Button 
                  variant="outline" 
                  size="icon" 
                  onClick={onDelete} 
                  className="text-red-400 border-red-400 hover:bg-red-400/20"
                >
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