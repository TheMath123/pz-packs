import { notificationRepository } from '@org/database'
import { ApiResponse } from '@/utils'

interface ListNotificationsControllerParams {
  user: { id: string }
}

export class ListNotificationsController {
  async handle({ user }: ListNotificationsControllerParams) {
    const notifications = await notificationRepository.listByUserId(user.id)
    return new ApiResponse(notifications, 200)
  }
}
