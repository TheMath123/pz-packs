import type { UseQueryOptions, UseQueryResult } from '@tanstack/react-query'
import { useQuery } from '@tanstack/react-query'
import { ModService } from '@/services/mod'
import type { IModDTO } from '@/services/mod/dtos'
import { modKeys } from './mod-keys'

export function useMod(
  id: string,
  options?: Omit<UseQueryOptions<IModDTO>, 'queryKey' | 'queryFn'>,
): UseQueryResult<IModDTO> {
  return useQuery({
    queryKey: modKeys.get(id),
    queryFn: async () => await ModService.get(id),
    staleTime: 1000 * 60 * 5,
    ...options,
  })
}
