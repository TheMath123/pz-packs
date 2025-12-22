import type { DModpack } from '@org/database/schemas'
import { env } from '@/env'
import { headers } from '../helpers'
import type { IModpackDTO } from './dtos'

export async function updateModpackService(
  id: string,
  data: Partial<DModpack>,
) {
  const url = `${env.VITE_API_URL}/modpacks/${id}`

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

  return dataResponse as IModpackDTO
}
