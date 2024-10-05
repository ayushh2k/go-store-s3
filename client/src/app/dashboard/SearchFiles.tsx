// src/app/dashboard/SearchFiles.tsx
'use client'

import { useState } from 'react'
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { CalendarIcon, Search, X } from "lucide-react"
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
    onSearch(fileName.trim(), formattedDate, contentType)
  }

  const handleClear = () => {
    setFileName('')
    setDate(undefined)
    setContentType('')
    onSearch('', '', '')
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="fileName" className="text-white text-lg">File Name</Label>
        <Input
          id="fileName"
          value={fileName}
          onChange={(e) => setFileName(e.target.value)}
          placeholder="Enter file name"
          className="bg-white/20 text-white placeholder-white/50 border-white/30 focus:border-white/60 transition-all duration-300"
        />
      </div>
      <div className="space-y-2">
        <Label className="text-white text-lg">Uploaded At</Label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant={"outline"}
              className={cn(
                "w-full justify-start text-left font-normal bg-white/20 text-white border-white/30 hover:bg-white/30",
                !date && "text-white/50"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {date ? format(date, "PPP") : <span>Pick a date</span>}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="bg-gradient-to-br from-blue-800 via-indigo-900 to-purple-900 border-white/30">
            <Calendar
              mode="single"
              selected={date}
              onSelect={setDate}
              initialFocus
              className="text-white"
            />
          </PopoverContent>
        </Popover>
      </div>
      <div className="space-y-2">
        <Label className="text-white text-lg">Content Type</Label>
        <Select value={contentType} onValueChange={setContentType}>
          <SelectTrigger className="bg-white/20 text-white border-white/30 focus:border-white/60 transition-all">
            <SelectValue placeholder="Select content type" />
          </SelectTrigger>
          <SelectContent className="bg-gradient-to-br from-blue-800 via-indigo-900 to-purple-900 border-white/30">
            <SelectItem value="all" className="text-white hover:bg-white/20">All</SelectItem>
            <SelectItem value="pdf" className="text-white hover:bg-white/20">PDF</SelectItem>
            <SelectItem value="image" className="text-white hover:bg-white/20">Image</SelectItem>
            <SelectItem value="document" className="text-white hover:bg-white/20">Document</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="flex space-x-4">
        <Button 
          className="flex-1 bg-white text-blue-800 hover:bg-blue-100 transition-all duration-300 transform hover:scale-105" 
          onClick={handleSearch}
        >
          <Search className="mr-2 h-5 w-5" />
          Search
        </Button>
        <Button 
          variant="outline" 
          onClick={handleClear}
          className="flex-1 border-white text-white hover:bg-white/20 transition-all duration-300 transform hover:scale-105"
        >
          <X className="mr-2 h-5 w-5" />
          Clear
        </Button>
      </div>
    </div>
  )
}