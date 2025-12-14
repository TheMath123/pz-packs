import type { UseQueryOptions, UseQueryResult } from '@tanstack/react-query'
import type { PaginatedResponse, PaginateQueryParams } from '@/services/dtos'
import { ModService } from '@/services/mod'
import type { IModDTO } from '@/services/mod/dtos'
import { usePaginated } from '../globals'
import { modKeys } from './mod-keys'

export function useListMyModpacks(
  queryParams: PaginateQueryParams = {},
  options?: Omit<
    UseQueryOptions<PaginatedResponse<IModDTO>>,
    'queryKey' | 'queryFn'
  >,
): UseQueryResult<PaginatedResponse<IModDTO>> {
  return usePaginated<IModDTO>({
    queryParams,
    queryKey: modKeys.list(queryParams),
    queryFn: ModService.list,
    options,
  })
}
