import { env } from '@/env'
import { headers } from '../helpers'
import type { IModpackDTO } from './dtos'

interface CreateModpackParams {
  name: string
  description?: string
  avatarUrl?: string
  steamUrl?: string
}

export async function createModpackService(params: CreateModpackParams) {
  const url = `${env.VITE_API_URL}/modpacks`

  const body = {
    name: params.name,
    description: params.description,
    avatarUrl: params.avatarUrl,
    steamWorkshopUrl: params.steamUrl,
  }

  const res = await fetch(url, {
    method: 'POST',
    credentials: 'include',
    headers: {
      ...headers,
    },
    body: JSON.stringify(body),
  })

  const data = await res.json()
  if (res.status !== 201) {
    throw new Error(data.message ?? 'We have a problem creating this modpack')
  }

  return data as IModpackDTO
}
