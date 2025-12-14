import type { UseQueryOptions, UseQueryResult } from '@tanstack/react-query'
import { useQuery } from '@tanstack/react-query'
import { ModpackService } from '@/services/modpack'
import type { IModpackDTO } from '@/services/modpack/dtos'
import { modpackKeys } from './modpack-keys'

export function useModpack(
  id: string,
  options?: Omit<UseQueryOptions<IModpackDTO>, 'queryKey' | 'queryFn'>,
): UseQueryResult<IModpackDTO> {
  return useQuery({
    queryKey: modpackKeys.get(id),
    queryFn: async () => await ModpackService.get(id),
    staleTime: 1000 * 60 * 5,
    ...options,
  })
}
