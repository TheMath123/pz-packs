import { Button } from '@org/design-system/components/ui/button'
import {
  Bell,
  CheckCircle,
  Info,
  Warning,
  XCircle,
} from '@org/design-system/components/ui/icons'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@org/design-system/components/ui/popover'
import { cn } from '@org/design-system/lib/utils'
import { formatDistanceToNow } from 'date-fns'
import {
  useMarkNotificationAsRead,
  useNotifications,
} from '@/hooks/notification'

export function NotificationPopover() {
  const { data: notifications, isLoading } = useNotifications()
  const markAsRead = useMarkNotificationAsRead()

  const unreadCount = notifications?.filter((n) => !n.isRead).length || 0

  const handleMarkAsRead = (id: string) => {
    markAsRead.mutate(id)
  }

  const getIcon = (type: string) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="w-5 h-5 text-green-500" />
      case 'warning':
        return <Warning className="w-5 h-5 text-yellow-500" />
      case 'error':
        return <XCircle className="w-5 h-5 text-red-500" />
      default:
        return <Info className="w-5 h-5 text-blue-500" />
    }
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="w-5 h-5" />
          {unreadCount > 0 && (
            <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full" />
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="end">
        <div className="p-4 border-b">
          <h4 className="font-semibold leading-none">Notifications</h4>
          <p className="text-sm text-muted-foreground mt-1">
            You have {unreadCount} unread messages
          </p>
        </div>
        <div className="max-h-[300px] overflow-y-auto">
          {isLoading ? (
            <div className="p-4 text-center text-sm text-muted-foreground">
              Loading...
            </div>
          ) : notifications?.length === 0 ? (
            <div className="p-4 text-center text-sm text-muted-foreground">
              No notifications
            </div>
          ) : (
            <div className="divide-y">
              {notifications?.map((notification) => (
                <div
                  key={notification.id}
                  className={cn(
                    'p-4 flex gap-3 hover:bg-muted/50 transition-colors cursor-pointer',
                    !notification.isRead && 'bg-muted/20',
                  )}
                  onClick={() =>
                    !notification.isRead && handleMarkAsRead(notification.id)
                  }
                >
                  <div className="mt-1">{getIcon(notification.type)}</div>
                  <div className="flex-1 space-y-1">
                    <p
                      className={cn(
                        'text-sm font-medium leading-none',
                        !notification.isRead && 'font-bold',
                      )}
                    >
                      {notification.title}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {notification.content}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {formatDistanceToNow(new Date(notification.createdAt), {
                        addSuffix: true,
                      })}
                    </p>
                  </div>
                  {!notification.isRead && (
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2" />
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </PopoverContent>
    </Popover>
  )
}
