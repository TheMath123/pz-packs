import { useMutation, useQueryClient } from '@tanstack/react-query'
import { ModpackService } from '@/services/modpack'
import { modpackKeys } from './modpack-keys'

export function useCreateModpack() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ModpackService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: modpackKeys.myLists() })
    },
  })
}
