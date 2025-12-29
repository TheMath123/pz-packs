import { notificationRepository } from '@org/database'
import type { Job } from 'bullmq'
import type { NotificationJobData } from '../notification/queue'

export const notificationProcessor = async (job: Job<NotificationJobData>) => {
  try {
    await notificationRepository.create({
      userId: job.data.userId,
      title: job.data.title,
      content: job.data.content,
      type: job.data.type,
      metadata: job.data.metadata,
    })
  } catch (error) {
    throw error
  }
}
