import { env } from '@/env'

export async function updateAllModsService() {
  const response = await fetch(`${env.VITE_API_URL}/mods/update-all`, {
    method: 'POST',
    credentials: 'include',
  })

  if (!response.ok) {
    throw new Error('Failed to update all mods')
  }

  return response.json()
}
