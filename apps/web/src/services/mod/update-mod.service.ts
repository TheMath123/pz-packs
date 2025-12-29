import { env } from '@/env'
import { headers } from '../helpers'
import type { IModDTO } from './dtos'

export interface UpdateModParams {
  id: string
  data: Partial<IModDTO>
}

export async function updateModService({ id, data }: UpdateModParams) {
  const url = `${env.VITE_API_URL}/mods/${id}`

  const res = await fetch(url, {
    method: 'PATCH',
    credentials: 'include',
    headers: { ...headers },
    body: JSON.stringify(data),
  })

  const dataResponse = await res.json()
  if (res.status !== 200) {
    throw new Error(
      dataResponse.message ?? 'We have a problem updating this modpack',
    )
  }

  return dataResponse as IModDTO
}
