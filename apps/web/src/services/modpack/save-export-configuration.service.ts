import { env } from '@/env'
import { headers } from '../helpers'
import type { ExportConfiguration } from './get-export-configuration.service'

export interface SaveExportConfigurationData {
  modsOrder?: string[]
  modConfig?: Record<string, { selectedSteamModIds: string[] }>
}

export async function saveExportConfigurationService(
  modpackId: string,
  payload: SaveExportConfigurationData,
) {
  const url = `${env.VITE_API_URL}/modpacks/${modpackId}/export-configuration`

  const res = await fetch(url, {
    method: 'PUT',
    credentials: 'include',
    headers: { ...headers, 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })

  const data = await res.json()

  if (res.status !== 200) {
    throw new Error(
      data.error?.message ??
        'We have a problem saving the export configuration',
    )
  }

  return data as ExportConfiguration
}
