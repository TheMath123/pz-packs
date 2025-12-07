import {
  Select,
  SelectContent,
  SelectItem,
  SelectPositioner,
  SelectTrigger,
  SelectValue,
} from '@org/design-system/components/ui/select'
import { useEffect, useState } from 'react'

interface SortOrderFilterProps {
  onSortOrderChange: (sortOrder: string) => void
  initialSortOrder?: string
}

const sortOrderOptions = [
  { label: 'Descending', value: 'desc' },
  { label: 'Ascending', value: 'asc' },
]

export function SortOrderFilter({
  onSortOrderChange,
  initialSortOrder = 'desc',
}: SortOrderFilterProps) {
  const [sortOrder, setSortOrder] = useState(initialSortOrder)

  useEffect(() => {
    onSortOrderChange(sortOrder)
  }, [sortOrder, onSortOrderChange])

  return (
    <Select
      value={sortOrder}
      onValueChange={(value) => value && setSortOrder(value)}
    >
      <SelectTrigger className="w-[140px]">
        <SelectValue placeholder="Order">
          {sortOrderOptions.find((option) => option.value === sortOrder)?.label}
        </SelectValue>
      </SelectTrigger>
      <SelectPositioner>
        <SelectContent>
          {sortOrderOptions.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </SelectPositioner>
    </Select>
  )
}
