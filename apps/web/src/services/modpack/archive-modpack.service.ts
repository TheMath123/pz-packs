import { env } from '@/env'
import { failure, headers, success } from '../helpers'

export async function archiveModpackService(id: string) {
  const url = `${env.VITE_API_URL}/modpacks/${id}`

  const res = await fetch(url, {
    method: 'DELETE',
    credentials: 'include',
    headers: { ...headers },
  })

  if (res.status !== 204) return failure(res)
  return success<void>(res)
}
