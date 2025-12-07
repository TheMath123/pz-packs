import type { DModpack } from '@org/database/schemas'
import { env } from '@/env'
import { failure, headers, success } from '../helpers'

export async function getModpackByIdService(id: string) {
  const url = `${env.VITE_API_URL}/modpacks/${id}`

  const res = await fetch(url, {
    method: 'GET',
    credentials: 'include',
    headers: { ...headers },
  })

  if (res.status !== 200) return failure(res)
  return success<DModpack>(res)
}
