import type { DModpack } from '@org/database/schemas'
import type { UseQueryOptions, UseQueryResult } from '@tanstack/react-query'
import { useQuery } from '@tanstack/react-query'
import { ModpackService } from '@/services/modpack'
import type { ModpackFilters } from '@/services/modpack/get-public-modpacks.service'
import type { PaginatedResponse } from '@/services/types'

export const modpackKeys = {
  all: ['modpacks'] as const,
  lists: () => [...modpackKeys.all, 'list'] as const,
  list: (filters: ModpackFilters) => [...modpackKeys.lists(), filters] as const,
  publicLists: () => [...modpackKeys.all, 'public'] as const,
  publicList: (filters: ModpackFilters) =>
    [...modpackKeys.publicLists(), filters] as const,
  myLists: () => [...modpackKeys.all, 'my'] as const,
  myList: (filters: ModpackFilters) =>
    [...modpackKeys.myLists(), filters] as const,
  details: () => [...modpackKeys.all, 'detail'] as const,
  detail: (id: string) => [...modpackKeys.details(), id] as const,
}

export function usePublicModpacks(
  filters: ModpackFilters = {},
  options?: Omit<
    UseQueryOptions<PaginatedResponse<DModpack>>,
    'queryKey' | 'queryFn'
  >,
): UseQueryResult<PaginatedResponse<DModpack>> {
  return useQuery({
    queryKey: modpackKeys.publicList(filters),
    queryFn: async () => {
      const result = await ModpackService.getPublicModpacks(filters)
      if (!result.success) {
        return [] as unknown as PaginatedResponse<DModpack>
      }
      return result.data
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
    ...options,
  })
}

export function useMyModpacks(
  filters: ModpackFilters = {},
  options?: Omit<
    UseQueryOptions<PaginatedResponse<DModpack>>,
    'queryKey' | 'queryFn'
  >,
): UseQueryResult<PaginatedResponse<DModpack>> {
  return useQuery({
    queryKey: modpackKeys.myList(filters),
    queryFn: async () => {
      const result = await ModpackService.getMyModpacks(filters)
      if (!result.success) {
        return [] as unknown as PaginatedResponse<DModpack>
      }
      return result.data
    },
    staleTime: 1000 * 60 * 5,
    ...options,
  })
}

export function useModpackById(
  id: string,
  options?: Omit<UseQueryOptions<DModpack>, 'queryKey' | 'queryFn'>,
): UseQueryResult<DModpack> {
  return useQuery({
    queryKey: modpackKeys.detail(id),
    queryFn: async () => {
      const result = await ModpackService.getById(id)
      if (!result.success) throw new Error(result.error)
      return result.data
    },
    staleTime: 1000 * 60 * 5,
    ...options,
  })
}
