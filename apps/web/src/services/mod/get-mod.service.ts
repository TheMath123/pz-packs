import { env } from '@/env'
import { headers } from '../helpers'
import type { IModDTO } from './dtos'

export async function getModService(id: string) {
  const url = `${env.VITE_API_URL}/mods/${id}`

  const res = await fetch(url, {
    method: 'GET',
    headers: { ...headers },
  })

  const data = await res.json()

  if (res.status !== 200) {
    throw new Error(data.error?.message ?? 'We have a problem getting the mod')
  }

  return data as IModDTO
}
