import type { UseQueryOptions, UseQueryResult } from '@tanstack/react-query'
import { useQuery } from '@tanstack/react-query'
import { ModService } from '@/services/mod'
import type { IModDTO } from '@/services/mod/dtos'
import { modKeys } from './mod-keys'

export function useModByWorkshopId(
  workshopId: string,
  options?: Omit<UseQueryOptions<IModDTO>, 'queryKey' | 'queryFn'>,
): UseQueryResult<IModDTO> {
  return useQuery({
    queryKey: modKeys.get(workshopId),
    queryFn: async () => await ModService.getModByWorkshopId(workshopId),
    staleTime: 1000 * 60 * 5,
    ...options,
  })
}
