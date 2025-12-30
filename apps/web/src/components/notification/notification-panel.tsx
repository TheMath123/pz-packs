import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@org/design-system/components/ui/sheet'
import { useState } from 'react'
import { useNotifications } from '@/hooks/notification'
import { Notification } from './notification'
import { NotificationButton } from './notification-button'

export function NotificationPanel() {
  const { data: notifications, isLoading } = useNotifications()
  const [open, setOpen] = useState(false)

  const unreadCount = notifications?.filter((n) => !n.isRead).length || 0

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger
        render={<NotificationButton unreadCount={unreadCount} />}
      ></SheetTrigger>
      <SheetContent>
        <SheetHeader className="border-b">
          <SheetTitle>Notifications</SheetTitle>
          <SheetDescription>
            You have {unreadCount} unread messages
          </SheetDescription>
        </SheetHeader>

        <div className="h-full overflow-y-auto">
          {isLoading ? (
            <div className="p-4 text-center text-sm text-muted-foreground">
              Loading...
            </div>
          ) : notifications?.length === 0 ? (
            <div className="p-4 text-center text-sm text-muted-foreground">
              No notifications
            </div>
          ) : (
            <div>
              {notifications?.map((notification) => (
                <Notification
                  data={notification}
                  key={notification.id}
                  onClose={() => setOpen(false)}
                />
              ))}
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  )
}
