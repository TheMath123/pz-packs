import { env } from '@/env'
import type { PaginatedResponse, PaginateQueryParams } from '../dtos'
import { headers, makeRequestQuery } from '../helpers'
import type { IModpackDTO } from './dtos'

export async function listMyModpacksService(
  queryParams: PaginateQueryParams = {},
) {
  const queryString = makeRequestQuery(queryParams as Record<string, string>)
  const url = `${env.VITE_API_URL}/modpacks/my${queryString}`

  const res = await fetch(url, {
    method: 'GET',
    credentials: 'include',
    headers: { ...headers },
  })

  const data = await res.json()
  if (res.status !== 200) {
    const { error } = data
    throw new Error(error.message ?? 'We have a problem listing the modpacks')
  }

  return data as PaginatedResponse<IModpackDTO>
}
