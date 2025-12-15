import { env } from '@/env'
import { headers } from '../helpers'
import type { Notification } from './dtos/notification.dto'

export async function markNotificationAsReadService(id: string) {
  const url = `${env.VITE_API_URL}/notifications/${id}/read`

  const res = await fetch(url, {
    method: 'PATCH',
    credentials: 'include',
    headers: {
      ...headers,
    },
  })

  const data = await res.json()

  if (res.status !== 200) {
    const { error } = data
    throw new Error(error.message ?? 'Failed to mark notification as read')
  }

  return data as Notification
}
