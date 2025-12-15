import { listNotificationsService } from './list-notifications.service'
import { markNotificationAsReadService } from './mark-notification-as-read.service'

export * from './dtos/notification.dto'

export const NotificationService = {
  list: listNotificationsService,
  markAsRead: markNotificationAsReadService,
}
