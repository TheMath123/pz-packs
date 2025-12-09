import type { UseQueryOptions, UseQueryResult } from '@tanstack/react-query'
import { useQuery } from '@tanstack/react-query'
import { ModpackService } from '@/services/modpack'
import type { ModpackMemberWithUser } from '@/services/modpack/get-members.service'
import { modpackKeys } from '../modpack/modpack-keys'

export function useModpackMembers(
  modpackId: string,
  options?: Omit<
    UseQueryOptions<ModpackMemberWithUser[]>,
    'queryKey' | 'queryFn'
  >,
): UseQueryResult<ModpackMemberWithUser[]> {
  return useQuery({
    queryKey: modpackKeys.members(modpackId),
    queryFn: async () => {
      const response = await ModpackService.getMembers(modpackId)
      if (!response.success) {
        throw new Error(response.error.message || 'Failed to fetch members')
      }
      return response.data
    },
    enabled: !!modpackId,
    ...options,
  })
}
