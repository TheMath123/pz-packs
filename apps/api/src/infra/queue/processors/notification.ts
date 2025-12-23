import { notificationRepository } from '@org/database'
import type { Job } from 'bullmq'
import type { NotificationJobData } from '../notification/queue'

export const notificationProcessor = async (job: Job<NotificationJobData>) => {
  // console.log(
  //   `[NotificationProcessor] Processing notification for user ${job.data.userId}`,
  // )

  try {
    await notificationRepository.create({
      userId: job.data.userId,
      title: job.data.title,
      content: job.data.content,
      type: job.data.type,
      metadata: job.data.metadata,
    })

    // console.log(
    //   `[NotificationProcessor] Notification saved for user ${job.data.userId}`,
    // )
  } catch (error) {
    // console.error(`[NotificationProcessor] Failed to save notification:`, error)
    throw error
  }
}
