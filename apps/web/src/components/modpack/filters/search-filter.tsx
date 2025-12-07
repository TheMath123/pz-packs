import { Input } from '@org/design-system/components/ui/input'
import { useEffect, useState } from 'react'

interface SearchFilterProps {
  onSearchChange: (search: string) => void
  initialSearch?: string
  debounceTime?: number
}

export function SearchFilter({
  onSearchChange,
  initialSearch = '',
  debounceTime = 500,
}: SearchFilterProps) {
  const [search, setSearch] = useState(initialSearch)

  useEffect(() => {
    const timer = setTimeout(() => {
      onSearchChange(search)
    }, debounceTime)

    return () => clearTimeout(timer)
  }, [search, onSearchChange, debounceTime])

  return (
    <div className="flex-1">
      <Input
        type="text"
        placeholder="Search modpacks name..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
    </div>
  )
}
