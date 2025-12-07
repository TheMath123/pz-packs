import type { DModpack } from '@org/database/schemas'
import { env } from '@/env'
import { failure, headers, success } from '../helpers'

type SuccessResponse = DModpack

export async function createModpackService(params: Partial<DModpack>) {
  const url = `${env.VITE_API_URL}/client`

  const res = await fetch(url, {
    method: 'POST',
    credentials: 'include',
    headers: {
      ...headers,
    },
    body: JSON.stringify(params),
  })

  if (res.status !== 201) return failure(res)
  return success<SuccessResponse>(res)
}
