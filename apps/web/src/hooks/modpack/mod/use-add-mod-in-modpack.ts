import { toast } from '@org/design-system/components/ui/sonner'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { ModpackModsService } from '@/services/modpack/mods'
import { modpackKeys } from '../modpack-keys'
import { modpackModsKeys } from './modpack-mods-keys'

interface AddModParams {
  modpackId: string
  modAtribute: string
}

export function useAddModInModpack() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ modpackId, modAtribute }: AddModParams) =>
      ModpackModsService.add(modpackId, modAtribute),
    onSuccess: (_, variables) => {
      toast.success('Mod added successfully')
      queryClient.invalidateQueries({
        queryKey: modpackModsKeys.list(variables.modpackId, {}),
      })
      queryClient.invalidateQueries({
        queryKey: modpackKeys.get(variables.modpackId),
      })
    },
    onError: (error) => {
      toast.error(
        (error as Error).message ||
          'Failed to add mod. Please try again later.',
      )
    },
  })
}
