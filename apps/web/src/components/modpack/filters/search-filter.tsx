import { Button } from '@org/design-system/components/ui/button'
import { X, XIcon } from '@org/design-system/components/ui/icons'
import { Input } from '@org/design-system/components/ui/input'
import { useEffect, useState } from 'react'

interface SearchFilterProps {
  onSearchChange: (search: string | undefined) => void
  value?: string
  debounceTime?: number
  placeholder?: string
}

export function SearchFilter({
  onSearchChange,
  value = '',
  debounceTime = 500,
  placeholder = 'Search by modpack name...',
}: SearchFilterProps) {
  const [search, setSearch] = useState(value)

  useEffect(() => {
    setSearch(value)
  }, [value])

  useEffect(() => {
    const timer = setTimeout(() => {
      if (search !== value) {
        onSearchChange(search || undefined)
      }
    }, debounceTime)

    return () => clearTimeout(timer)
  }, [search, debounceTime, onSearchChange, value])

  return (
    <div className="flex-1 relative">
      <Input
        type="search"
        placeholder={placeholder}
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="appearance-none 
    [&::-webkit-search-cancel-button]:hidden 
    [&::-webkit-search-decoration]:hidden 
    [&::-webkit-search-results-button]:hidden 
    [&::-webkit-search-results-decoration]:hidden
    pr-8"
      />
      {search && (
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={() => setSearch('')}
          className="absolute right-2 top-1/2 -translate-y-1/2"
          aria-label="Clear search"
          title="Clear search"
        >
          <XIcon className="w-4 h-4" weight="bold" />
        </Button>
      )}
    </div>
  )
}
