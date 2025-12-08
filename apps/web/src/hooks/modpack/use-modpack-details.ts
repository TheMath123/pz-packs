import type { UseQueryOptions, UseQueryResult } from '@tanstack/react-query'
import { useQuery } from '@tanstack/react-query'
import { ModpackService } from '@/services/modpack'
import type { ModpackWithMembers } from '@/services/modpack/get-modpack-details.service'
import { modpackKeys } from './modpack-keys'

export function useModpackDetails(
  id: string,
  options?: Omit<UseQueryOptions<ModpackWithMembers>, 'queryKey' | 'queryFn'>,
): UseQueryResult<ModpackWithMembers> {
  return useQuery({
    queryKey: modpackKeys.detail(id),
    queryFn: async () => {
      const response = await ModpackService.getById(id)
      if (!response.success) {
        throw new Error(response.error.message || 'Failed to fetch modpack')
      }
      return response.data
    },
    enabled: !!id,
    ...options,
  })
}
