import { Button } from '@org/design-system/components/ui/button'
import { Card } from '@org/design-system/components/ui/card'

interface ReorderModsListSkeletonProps {
  onClose: () => void
}

export function ReorderModsListSkeleton({
  onClose,
}: ReorderModsListSkeletonProps) {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-bold">Reorder & Configure Export</h3>
        <div className="flex gap-2">
          <Button variant="outline" onClick={onClose} disabled>
            Cancel
          </Button>
          <Button disabled>Save</Button>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        {Array.from({ length: 5 }).map((_, i) => (
          <Card
            key={i}
            className="p-4 flex flex-row items-center gap-4 animate-pulse h-28"
          >
            <div className="h-8 w-6 bg-muted animate-pulse rounded" />
            <div className="w-12 h-12 rounded-md bg-muted animate-pulse" />
            <div className="flex-1 flex flex-col gap-2 w-full">
              <div className="h-5 w-1/3 bg-muted animate-pulse rounded" />
              <div className="h-4 w-1/4 bg-muted animate-pulse rounded" />
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}
