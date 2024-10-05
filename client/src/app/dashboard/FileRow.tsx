// src/app/dashboard/FileRow.tsx
import { TableCell, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Edit } from "lucide-react"

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
  return (
    <TableRow>
      <TableCell>{file.FileName.split('/').pop()}</TableCell>
      <TableCell>{(file.FileSize / 1024 / 1024).toFixed(2)} MB</TableCell>
      <TableCell>{file.ContentType}</TableCell>
      <TableCell>{new Date(file.UploadedAt).toLocaleString()}</TableCell>
      <TableCell>
        <Button variant="outline" size="sm" onClick={onShare}>
          Share
        </Button>
        <Button variant="outline" size="sm" onClick={onUpdate}>
          {/* <Edit className="h-4 w-4 mr-2" /> */}
          Edit
        </Button>
        <Button variant="destructive" size="sm" onClick={onDelete}>Delete</Button>
      </TableCell>
    </TableRow>
  )
}