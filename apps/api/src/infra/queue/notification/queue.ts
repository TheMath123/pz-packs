import { Queue } from 'bullmq'
import { connection } from '../connection'

export const NOTIFICATION_QUEUE_NAME = 'notifications'

export interface NotificationJobData {
  userId: string
  title: string
  content: string
  type: 'info' | 'success' | 'warning' | 'error'
  metadata?: string
}

export const notificationQueue = new Queue(NOTIFICATION_QUEUE_NAME, {
  connection,
})
