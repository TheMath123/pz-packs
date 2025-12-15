import { notificationRepository } from '@org/database'
import { ApiResponse } from '@/utils'

interface MarkNotificationAsReadControllerParams {
  params: { id: string }
  user: { id: string }
}

export class MarkNotificationAsReadController {
  async handle({ params, user }: MarkNotificationAsReadControllerParams) {
    const notification = await notificationRepository.markAsRead(
      params.id,
      user.id,
    )
    return new ApiResponse(notification, 200)
  }
}
