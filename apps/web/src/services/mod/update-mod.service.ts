import { env } from '@/env'

export interface UpdateModParams {
  id: string
  data: {
    name?: string
    description?: string
    steamUrl?: string
    avatarUrl?: string
    mapFolders?: string[]
    requiredMods?: string[]
    tags?: string[]
  }
}

export async function updateModService({ id, data }: UpdateModParams) {
  const response = await fetch(`${env.VITE_API_URL}/mods/${id}`, {
    method: 'PATCH',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  })

  if (!response.ok) {
    throw new Error('Failed to update mod')
  }

  return response.json()
}
