import { useState } from 'react'
import { SearchFilter } from './search-filter'
import { SortByFilter } from './sort-by-filter'
import { SortOrderFilter } from './sort-order-filter'

interface ModpackFiltersProps {
  onSearchChange: (search: string) => void
  onSortChange: (sortBy: string, sortOrder: string) => void
  initialSearch?: string
  initialSortBy?: string
  initialSortOrder?: string
}

export function ModpackFilters({
  onSearchChange,
  onSortChange,
  initialSearch = '',
  initialSortBy = 'createdAt',
  initialSortOrder = 'desc',
}: ModpackFiltersProps) {
  const [sortBy, setSortBy] = useState(initialSortBy)
  const [sortOrder, setSortOrder] = useState(initialSortOrder)

  const handleSortByChange = (newSortBy: string) => {
    setSortBy(newSortBy)
    onSortChange(newSortBy, sortOrder)
  }

  const handleSortOrderChange = (newSortOrder: string) => {
    setSortOrder(newSortOrder)
    onSortChange(sortBy, newSortOrder)
  }

  return (
    <div className="flex flex-col md:flex-row gap-4 mb-6">
      <SearchFilter
        onSearchChange={onSearchChange}
        initialSearch={initialSearch}
      />

      <div className="flex gap-2">
        <SortByFilter
          onSortByChange={handleSortByChange}
          initialSortBy={initialSortBy}
        />

        <SortOrderFilter
          onSortOrderChange={handleSortOrderChange}
          initialSortOrder={initialSortOrder}
        />
      </div>
    </div>
  )
}
