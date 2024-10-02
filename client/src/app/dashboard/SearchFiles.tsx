'use client'

import { useState } from 'react'
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { searchFiles } from '@/lib/api'

export default function SearchFiles() {
  const [searchTerm, setSearchTerm] = useState('')

  const handleSearch = async () => {
    const results = await searchFiles(searchTerm)
    // Update the file list with search results
    // You might want to lift this state up to the parent component
    // or use a state management solution like Redux or Zustand
  }

  return (
    <div>
      <Label htmlFor="search">Search Files</Label>
      <div className="flex space-x-2">
        <Input 
          id="search" 
          type="text" 
          value={searchTerm} 
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search files..."
        />
        <Button onClick={handleSearch}>Search</Button>
      </div>
    </div>
  )
}