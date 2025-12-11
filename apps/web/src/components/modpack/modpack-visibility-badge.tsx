import { Badge } from '@org/design-system/components/ui/badge'

export function ModpackVisibilityBadge({
  isPublic,
  className,
}: {
  isPublic: boolean
  className?: string
}) {
  if (isPublic)
    return (
      <Badge variant="solid" size="sm" className={className}>
        Public
      </Badge>
    )

  return (
    <Badge variant="solid" size="sm" className={className}>
      Private
    </Badge>
  )
}
