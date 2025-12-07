import type { DModpack } from '@org/database/schemas'
import { env } from '@/env'
import { failure, headers, success } from '../helpers'

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

  if (res.status !== 200) return failure(res)
  return success<DModpack>(res)
}
