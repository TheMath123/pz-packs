import { env } from '@/env'
import { headers } from '../helpers'
import type { INotificationDTO } from './dtos/notification.dto'

export async function listNotificationsService() {
  const url = `${env.VITE_API_URL}/notifications`

  const res = await fetch(url, {
    method: 'GET',
    credentials: 'include',
    headers: {
      ...headers,
    },
  })

  const data = await res.json()

  if (res.status !== 200) {
    const { error } = data
    throw new Error(error.message ?? 'Failed to list notifications')
  }

  return data as INotificationDTO[]
}
