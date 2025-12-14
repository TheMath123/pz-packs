import { env } from '@/env'
import { headers } from '../../helpers'

export interface ImportStatusResponse {
  status: 'active' | 'waiting' | 'completed' | 'failed' | 'delayed' | 'idle'
  progress: number
  result?: any
  error?: string
}

export async function getImportStatusService(modpackId: string) {
  const url = `${env.VITE_API_URL}/modpacks/${modpackId}/import/status`

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
    throw new Error(error.message ?? 'Failed to get import status')
  }

  return data as ImportStatusResponse
}
