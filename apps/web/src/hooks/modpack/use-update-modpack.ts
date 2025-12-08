import { useMutation, useQueryClient } from '@tanstack/react-query'
import { ModpackService } from '@/services/modpack'
import { modpackKeys } from './modpack-keys'

interface UpdateModpackParams {
  id: string
  data: {
    name?: string
    description?: string
    avatarUrl?: string
    steamUrl?: string
    isPublic?: boolean
  }
}

export function useUpdateModpack() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: UpdateModpackParams) =>
      ModpackService.update(id, data),
    onSuccess: (_, variables) => {
      // Invalidate specific modpack detail
      queryClient.invalidateQueries({
        queryKey: modpackKeys.detail(variables.id),
      })
      // Invalidate my modpacks list
      queryClient.invalidateQueries({ queryKey: modpackKeys.myLists() })
    },
  })
}
