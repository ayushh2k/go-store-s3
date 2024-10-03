// src/app/dashboard/SearchFiles.tsx
'use client'

import { useState } from 'react'
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { CalendarIcon } from "@radix-ui/react-icons"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface SearchFilesProps {
  onSearch: (fileName: string, uploadedAt: string, contentType: string) => void;
}

export default function SearchFiles({ onSearch }: SearchFilesProps) {
  const [fileName, setFileName] = useState('')
  const [date, setDate] = useState<Date | undefined>(undefined)
  const [contentType, setContentType] = useState('')

  const handleSearch = () => {
    const formattedDate = date ? format(date, 'dd-MM-yyyy') : ''
    console.log('Search params:', { fileName: fileName.trim(), uploadedAt: formattedDate, contentType }) // Debug log
    onSearch(fileName.trim(), formattedDate, contentType)
  }

  const handleClear = () => {
    setFileName('')
    setDate(undefined)
    setContentType('')
    onSearch('', '', '')
  }

  return (
    <div className="space-y-4">
      <div className="grid gap-2">
        <Label htmlFor="fileName">File Name</Label>
        <Input
          id="fileName"
          value={fileName}
          onChange={(e) => setFileName(e.target.value)}
          placeholder="Enter file name"
        />
      </div>
      <div className="grid gap-2">
        <Label>Uploaded At</Label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant={"outline"}
              className={cn(
                "w-full justify-start text-left font-normal",
                !date && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {date ? format(date, "PPP") : <span>Pick a date</span>}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <Calendar
              mode="single"
              selected={date}
              onSelect={setDate}
              initialFocus
            />
          </PopoverContent>
        </Popover>
      </div>
      <div className="grid gap-2">
        <Label>Content Type</Label>
        <Select value={contentType} onValueChange={setContentType}>
          <SelectTrigger>
            <SelectValue placeholder="Select content type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="pdf">PDF</SelectItem>
            <SelectItem value="image">Image</SelectItem>
            <SelectItem value="document">Document</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="flex space-x-2">
        <Button className="flex-1" onClick={handleSearch}>
          Search
        </Button>
        <Button variant="outline" onClick={handleClear}>
          Clear
        </Button>
      </div>
    </div>
  )
}