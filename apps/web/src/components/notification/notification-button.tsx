import { Badge } from '@org/design-system/components/ui/badge'
import { Button } from '@org/design-system/components/ui/button'
import { BellIcon } from '@org/design-system/components/ui/icons'

export function NotificationButton({
  unreadCount,
  ...props
}: {
  unreadCount: number
}) {
  return (
    <Button size="icon" variant="outline" className="relative" {...props}>
      <BellIcon className="w-5 h-5" weight="bold" />
      {unreadCount > 0 && (
        <Badge
          variant="destructive"
          className="absolute top-0 right-0 translate-x-1/2 -translate-y-1/2 h-5 min-w-5 p-0 px-0.5 rounded-full empty:h-2.5 empty:min-w-2.5 text-xs flex items-center justify-center"
        >
          {unreadCount}
        </Badge>
      )}
    </Button>
  )
}
