import type { UseQueryOptions, UseQueryResult } from '@tanstack/react-query'
import { useQuery } from '@tanstack/react-query'
import { ModpackService } from '@/services/modpack'
import type { IModpackDTO } from '@/services/modpack/dtos'
import { modpackKeys } from './modpack-keys'

export function usePublicModpack(
  id: string,
  options?: Omit<UseQueryOptions<IModpackDTO>, 'queryKey' | 'queryFn'>,
): UseQueryResult<IModpackDTO> {
  return useQuery({
    queryKey: [...modpackKeys.get(id), 'public'],
    queryFn: async () => await ModpackService.getPublic(id),
    staleTime: 1000 * 60 * 5,
    ...options,
  })
}
