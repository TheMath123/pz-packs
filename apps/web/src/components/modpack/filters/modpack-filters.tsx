import { SearchFilter } from './search-filter'
import { SortByFilter } from './sort-by-filter'
import { SortOrderFilter } from './sort-order-filter'

interface ModpackFiltersProps {
  onSearchChange: (search: string | undefined) => void
  onSortChange: (sortBy: string, sortOrder: string) => void
  search?: string
  sortBy?: string
  sortOrder?: string
}

export function ModpackFilters({
  onSearchChange,
  onSortChange,
  search = '',
  sortBy = 'createdAt',
  sortOrder = 'desc',
}: ModpackFiltersProps) {
  const handleSortByChange = (newSortBy: string) => {
    onSortChange(newSortBy, sortOrder)
  }

  const handleSortOrderChange = (newSortOrder: string) => {
    onSortChange(sortBy, newSortOrder)
  }

  return (
    <div className="flex flex-col md:flex-row gap-4 mb-6">
      <SearchFilter
        onSearchChange={onSearchChange}
        value={search}
        placeholder="Search by mod name..."
      />

      <div className="flex gap-2">
        <SortByFilter onSortByChange={handleSortByChange} value={sortBy} />

        <SortOrderFilter
          onSortOrderChange={handleSortOrderChange}
          value={sortOrder}
        />
      </div>
    </div>
  )
}
