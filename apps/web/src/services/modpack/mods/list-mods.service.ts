import { env } from '@/env'
import type { PaginatedResponse, PaginateQueryParams } from '@/services/dtos'
import { headers, makeRequestQuery } from '@/services/helpers'
import type { IModDTO } from '@/services/mod/dtos'

export async function listModpackModsService(
  modpackId: string,
  queryParams: PaginateQueryParams = {},
) {
  const queryString = makeRequestQuery(queryParams as Record<string, string>)
  const url = `${env.VITE_API_URL}/modpacks/${modpackId}/mods${queryString}`

  const res = await fetch(url, {
    method: 'GET',
    credentials: 'include',
    headers: { ...headers },
  })

  const data = await res.json()

  if (res.status !== 200) {
    throw new Error(data.error?.message ?? 'We have a problem listing the mods')
  }

  return data as PaginatedResponse<IModDTO>
}
