export interface INotificationDTO {
  id: string
  userId: string
  title: string
  content: string
  type: 'info' | 'success' | 'warning' | 'error'
  isRead: boolean
  metadata?: string
  createdAt: string
}
