import { notificationRepository } from '@org/database'
import { Worker } from 'bullmq'
import { connection } from '../connection'
import { NOTIFICATION_QUEUE_NAME, type NotificationJobData } from './queue'

export const notificationWorker = new Worker<NotificationJobData>(
  NOTIFICATION_QUEUE_NAME,
  async (job) => {
    console.log(
      `[NotificationWorker] Processing notification for user ${job.data.userId}`,
    )

    try {
      await notificationRepository.create({
        userId: job.data.userId,
        title: job.data.title,
        content: job.data.content,
        type: job.data.type,
        metadata: job.data.metadata,
      })

      console.log(
        `[NotificationWorker] Notification saved for user ${job.data.userId}`,
      )
    } catch (error) {
      console.error(`[NotificationWorker] Failed to save notification:`, error)
      throw error
    }
  },
  {
    connection,
  },
)
