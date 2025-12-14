import type { UseQueryOptions, UseQueryResult } from '@tanstack/react-query'
import { usePaginated } from '@/hooks/globals'
import type { PaginatedResponse, PaginateQueryParams } from '@/services/dtos'
import type { IModDTO } from '@/services/mod/dtos'
import { ModpackModsService } from '@/services/modpack/mods'
import { modpackModsKeys } from './modpack-mods-keys'

export function useListModpackMods(
  queryParams: PaginateQueryParams = {},
  modpackId: string,
  options?: Omit<
    UseQueryOptions<PaginatedResponse<IModDTO>>,
    'queryKey' | 'queryFn'
  >,
): UseQueryResult<PaginatedResponse<IModDTO>> {
  return usePaginated<IModDTO>({
    queryParams,
    queryKey: modpackModsKeys.list(modpackId, queryParams),
    queryFn: async () => await ModpackModsService.list(modpackId, queryParams),
    options,
  })
}
