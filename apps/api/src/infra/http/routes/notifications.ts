import { z } from '@org/validation/zod'
import { makeListNotificationsController } from '@/domain/notification/factories/make-list-notifications-controller'
import { makeMarkNotificationAsReadController } from '@/domain/notification/factories/make-mark-notification-as-read-controller'
import type { Server } from '../server'

export function notificationRoutes(app: Server) {
  app.group('/notifications', (route) => {
    // List notifications
    route.get(
      '/',
      async ({ status, user }) => {
        const controller = makeListNotificationsController()
        const res = await controller.handle({ user })
        return status(res.status, res.value)
      },
      {
        auth: true,
        detail: {
          tags: ['Notifications'],
          description: 'List user notifications',
          summary: 'List Notifications',
        },
      },
    )

    // Mark as read
    route.patch(
      '/:id/read',
      async ({ status, params, user }) => {
        const controller = makeMarkNotificationAsReadController()
        const res = await controller.handle({ params, user })
        return status(res.status, res.value)
      },
      {
        auth: true,
        params: z.object({ id: z.string().uuid() }),
        detail: {
          tags: ['Notifications'],
          description: 'Mark a notification as read',
          summary: 'Mark Notification Read',
        },
      },
    )

    return route
  })

  return app
}
