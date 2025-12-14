import { toast } from '@org/design-system/components/ui/sonner'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { ModpackModsService } from '@/services/modpack/mods'
import { modpackModsKeys } from './modpack-mods-keys'

interface RemoveModParams {
  modpackId: string
  modId: string
}

export function useRemoveModFromModpack() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ modpackId, modId }: RemoveModParams) =>
      ModpackModsService.remove(modpackId, modId),
    onSuccess: (_, variables) => {
      toast.success('Mod removed successfully')
      queryClient.invalidateQueries({
        queryKey: modpackModsKeys.list(variables.modpackId),
      })
    },
    onError: (error) => {
      toast.error(
        (error as Error).message ||
          'Failed to remove mod. Please try again later.',
      )
    },
  })
}
