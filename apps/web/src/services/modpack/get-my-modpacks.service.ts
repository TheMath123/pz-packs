import type { DModpack } from '@org/database/schemas'
import { env } from '@/env'
import { failure, headers, makeRequestQuery, success } from '../helpers'
import type { PaginatedResponse } from '../types'
import type { ModpackFilters } from './get-public-modpacks.service'

export async function getMyModpacksService(filters: ModpackFilters = {}) {
  const queryString = makeRequestQuery(filters as Record<string, string>)
  const url = `${env.VITE_API_URL}/modpacks/my${queryString}`

  const res = await fetch(url, {
    method: 'GET',
    credentials: 'include',
    headers: { ...headers },
  })

  if (res.status !== 200) return failure(res)
  return success<PaginatedResponse<DModpack>>(res)
}
