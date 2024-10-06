// src/app/dashboard/SearchFiles.tsx
'use client'

import { useState } from 'react'
import { Input } from "@/components/ui/input"
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
    <div className="space-y-4">
      <Input
        value={fileName}
        onChange={(e) => setFileName(e.target.value)}
        placeholder="File name"
        className="bg-[#1e1e1e] text-white placeholder-gray-500 border-[#2a2a2a] focus:border-[#22c55e] text-sm"
      />
      <div className="flex space-x-2">
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant={"outline"}
              className={cn(
                "flex-1 justify-start text-left text-sm font-normal bg-[#1e1e1e] text-white border-[#2a2a2a] hover:bg-[#2a2a2a] hover:border-[#22c55e]",
                !date && "text-gray-500"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {date ? format(date, "dd/MM/yy") : <span>Date</span>}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="bg-[#242424] border-[#2a2a2a] p-0">
            <Calendar
              mode="single"
              selected={date}
              onSelect={setDate}
              initialFocus
              className="text-white"
            />
          </PopoverContent>
        </Popover>
        <Select value={contentType} onValueChange={setContentType}>
          <SelectTrigger className="flex-1 bg-[#1e1e1e] text-white text-gray-500 border-[#2a2a2a] focus:border-[#22c55e] text-sm">
            <SelectValue  className="bg-[#1e1e1e] text-gray-500" placeholder="Type" />
          </SelectTrigger>
          <SelectContent className="bg-[#242424] border-[#2a2a2a]">
            <SelectItem value="all" className="text-white hover:bg-[#2a2a2a]">All</SelectItem>
            <SelectItem value="pdf" className="text-white hover:bg-[#2a2a2a]">PDF</SelectItem>
            <SelectItem value="image" className="text-white hover:bg-[#2a2a2a]">Image</SelectItem>
            <SelectItem value="document" className="text-white hover:bg-[#2a2a2a]">Document</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="flex space-x-2">
        <Button 
          className="flex-1 bg-[#22c55e] text-white hover:bg-[#1ea34b] text-sm py-1"
          onClick={handleSearch}
        >
          <Search className="mr-1 h-4 w-4" />
          Search
        </Button>
        <Button 
          variant="outline" 
          onClick={handleClear}
          className="flex-1 border-[#22c55e] text-[#22c55e] hover:bg-[#22c55e] hover:text-white text-sm py-1"
        >
          <X className="mr-1 h-4 w-4" />
          Clear
        </Button>
      </div>
    </div>
  )
}