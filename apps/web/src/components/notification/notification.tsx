import {
  CheckCircleIcon,
  InfoIcon,
  WarningIcon,
  XCircleIcon,
} from '@org/design-system/components/ui/icons'
import { cn } from '@org/design-system/lib/utils'
import { formatDistanceToNow } from 'date-fns'
import type { JSX } from 'react'
import { useMarkNotificationAsRead } from '@/hooks/notification'
import type { INotificationDTO } from '@/services/notification'

const icons: Record<string, JSX.Element> = {
  success: <CheckCircleIcon className="w-5 h-5 text-green-500" weight="bold" />,
  warning: <WarningIcon className="w-5 h-5 text-yellow-500" weight="bold" />,
  error: <XCircleIcon className="w-5 h-5 text-red-500" weight="bold" />,
  default: <InfoIcon className="w-5 h-5 text-blue-500" weight="bold" />,
}

export function Notification({ data }: { data: INotificationDTO }) {
  const markAsRead = useMarkNotificationAsRead()

  const handleMarkAsRead = (id: string) => {
    markAsRead.mutate(id)
  }

  return (
    <button
      type="button"
      key={data.id}
      className={cn(
        'p-4 flex gap-3 hover:bg-muted/50 transition-colors cursor-pointer',
        !data.isRead && 'bg-muted/20',
      )}
      onClick={() => !data.isRead && handleMarkAsRead(data.id)}
    >
      <div className="mt-1">{icons[data.type] || icons['default']}</div>
      <div className="flex-1 space-y-1">
        <p
          className={cn(
            'text-sm font-medium leading-none',
            !data.isRead && 'font-bold',
          )}
        >
          {data.title}
        </p>
        <p className="text-sm text-muted-foreground">{data.content}</p>
        <p className="text-xs text-muted-foreground">
          {formatDistanceToNow(new Date(data.createdAt), {
            addSuffix: true,
          })}
        </p>
      </div>
      {!data.isRead && (
        <div className="w-2 h-2 bg-blue-500 rounded-full mt-2" />
      )}
    </button>
  )
}
