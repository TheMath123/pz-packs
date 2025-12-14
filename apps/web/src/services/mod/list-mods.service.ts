import { env } from '@/env'
import type { PaginatedResponse, PaginateQueryParams } from '../dtos'
import { headers, makeRequestQuery } from '../helpers'
import type { IModDTO } from './dtos'

export async function listModsService(queryParams: PaginateQueryParams = {}) {
  const queryString = makeRequestQuery(queryParams as Record<string, string>)
  const url = `${env.VITE_API_URL}/mods${queryString}`

  const res = await fetch(url, {
    method: 'GET',
    headers: { ...headers },
  })

  const data = await res.json()

  if (res.status !== 200) {
    throw new Error(data.error?.message ?? 'We have a problem listing the mods')
  }

  return data as PaginatedResponse<IModDTO>
}
