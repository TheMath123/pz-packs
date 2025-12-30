import { env } from '@/env'
import { headers } from '../helpers'

export interface ExportConfiguration {
  id: string
  modpackId: string
  userId: string
  modsOrder?: string[]
  modConfig?: Record<string, { selectedSteamModIds: string[] }>
  createdAt: string
  updatedAt: string
}

export async function getExportConfigurationService(modpackId: string) {
  const url = `${env.VITE_API_URL}/modpacks/${modpackId}/export-configuration`

  const res = await fetch(url, {
    method: 'GET',
    credentials: 'include',
    headers: { ...headers },
  })

  const data = await res.json()

  if (res.status !== 200) {
    return null
  }

  return data as ExportConfiguration
}
