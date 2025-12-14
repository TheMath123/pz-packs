import { env } from '@/env'
import { headers } from '../helpers'
import type { IModpackDTO } from './dtos'

export async function getPublicModpackService(id: string) {
  const url = `${env.VITE_API_URL}/modpacks/public/${id}`

  const res = await fetch(url, {
    method: 'GET',
    credentials: 'include',
    headers: { ...headers },
  })

  const data = await res.json()

  if (res.status !== 200) {
    throw new Error(
      data.error?.message ?? 'We have a problem getting the modpack',
    )
  }

  return data as IModpackDTO
}
