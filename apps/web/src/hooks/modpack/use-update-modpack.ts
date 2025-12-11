import { toast } from '@org/design-system/components/ui/sonner'
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
      toast.success('Modpack updated successfully')
      queryClient.invalidateQueries({
        queryKey: modpackKeys.detail(variables.id),
      })
      queryClient.invalidateQueries({ queryKey: modpackKeys.myLists() })
    },
    onError: (error) => {
      toast.error(
        (error as Error).message ||
          'Failed to update modpack. Please try again later.',
      )
    },
  })
}
