import {
  Select,
  SelectContent,
  SelectItem,
  SelectPositioner,
  SelectTrigger,
  SelectValue,
} from '@org/design-system/components/ui/select'
import { useEffect, useState } from 'react'

interface SortByFilterProps {
  onSortByChange: (sortBy: string) => void
  initialSortBy?: string
}

const sortOptions = [
  { label: 'Created Date', value: 'createdAt' },
  { label: 'Updated Date', value: 'updatedAt' },
  { label: 'Name', value: 'name' },
]

export function SortByFilter({
  onSortByChange,
  initialSortBy = 'createdAt',
}: SortByFilterProps) {
  const [sortBy, setSortBy] = useState(initialSortBy)

  useEffect(() => {
    onSortByChange(sortBy)
  }, [sortBy, onSortByChange])

  return (
    <Select value={sortBy} onValueChange={(value) => value && setSortBy(value)}>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Sort by">
          {sortOptions.find((option) => option.value === sortBy)?.label}
        </SelectValue>
      </SelectTrigger>
      <SelectPositioner>
        <SelectContent>
          {sortOptions.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </SelectPositioner>
    </Select>
  )
}
