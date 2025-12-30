import { env } from '@/env'

export function downloadServerFile(exportId: string) {
  const url = `${env.VITE_API_URL}/modpacks/export/${exportId}/download`
  console.log(url)
  window.open(url, '_blank')
}
