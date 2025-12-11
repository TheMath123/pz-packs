import { env } from '@/env'
import { headers } from '../helpers'
import type { IModpackDTO } from './dtos'

export async function getModpackService(id: string) {
  const url = `${env.VITE_API_URL}/modpacks/${id}`

  const res = await fetch(url, {
    method: 'GET',
    credentials: 'include',
    headers: { ...headers },
  })

  const data = await res.json()

  if (res.status !== 200) {
    throw new Error(
      data.error?.message ?? 'We have a problem listing the modpacks',
    )
  }

  return data as IModpackDTO
}
