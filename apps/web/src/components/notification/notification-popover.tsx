import {
  Popover,
  PopoverContent,
  PopoverPositioner,
  PopoverTrigger,
} from '@org/design-system/components/ui/popover'
import { useNotifications } from '@/hooks/notification'
import { Notification } from './notification'
import { NotificationButton } from './notification-button'

export function NotificationPopover() {
  const { data: notifications, isLoading } = useNotifications()

  const unreadCount = notifications?.filter((n) => !n.isRead).length || 0

  return (
    <Popover>
      <PopoverTrigger
        render={<NotificationButton unreadCount={unreadCount} />}
      ></PopoverTrigger>
      <PopoverPositioner align="end">
        <PopoverContent className="w-80 p-0">
          <div className="p-4 border-b">
            <h4 className="font-semibold leading-none">Notifications</h4>
            <p className="text-sm text-muted-foreground mt-1">
              You have {unreadCount} unread messages
            </p>
          </div>
          <div className="max-h-[300px] overflow-y-auto ">
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
                  <Notification data={notification} key={notification.id} />
                ))}
              </div>
            )}
          </div>
        </PopoverContent>
      </PopoverPositioner>
    </Popover>
  )
}
