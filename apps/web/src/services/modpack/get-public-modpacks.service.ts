import type { DModpack } from '@org/database/schemas'
import { env } from '@/env'
import { failure, headers, makeRequestQuery, success } from '../helpers'
import type { PaginatedResponse } from '../types'

export interface ModpackFilters {
  page?: string
  limit?: string
  search?: string
  sortBy?: string
  sortOrder?: string
  [key: string]: unknown
}

export async function getPublicModpacksService(filters: ModpackFilters = {}) {
  const queryString = makeRequestQuery(filters as Record<string, string>)
  const url = `${env.VITE_API_URL}/modpacks/public${queryString}`

  const res = await fetch(url, {
    method: 'GET',
    headers: { ...headers },
  })

  console.log(res)

  if (res.status !== 200) return failure(res)
  return success<PaginatedResponse<DModpack>>(res)
}
