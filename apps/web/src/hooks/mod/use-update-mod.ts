import { useMutation, useQueryClient } from '@tanstack/react-query'
import {
  type UpdateModParams,
  updateModService,
} from '@/services/mod/update-mod.service'

export function useUpdateMod() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (params: UpdateModParams) => updateModService(params),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['mods'] })
    },
  })
}
