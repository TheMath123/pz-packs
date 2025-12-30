import { env } from '@/env'

export interface ExportFileInfo {
  mods: string
  map: string
  workshopItems: string
}

export async function fetchExportFileInfo(
  exportId: string,
): Promise<ExportFileInfo> {
  const url = `${env.VITE_API_URL}/modpacks/export/${exportId}/download`
  const res = await fetch(url, { credentials: 'include' })
  const text = await res.text()
  // Parse plain text
  const modsMatch = text.match(/Mods=(.*)/)
  const mapMatch = text.match(/Map=(.*)/)
  const workshopMatch = text.match(/WorkshopItems=(.*)/)
  return {
    mods: modsMatch ? modsMatch[1].trim() : '',
    map: mapMatch ? mapMatch[1].trim() : '',
    workshopItems: workshopMatch ? workshopMatch[1].trim() : '',
  }
}
