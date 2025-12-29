import { toast } from '@org/design-system/components/ui/sonner'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { ModService } from '@/services/mod'
import type { IModDTO } from '@/services/mod/dtos'
import { modKeys } from './mod-keys'

interface UpdateModParams {
  id: string
  data: Partial<IModDTO>
}

export function useUpdateMod() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: UpdateModParams) =>
      ModService.update({ id, data }),
    onSuccess: (_, variables) => {
      toast.success('Mod updated successfully')
      queryClient.invalidateQueries({
        queryKey: modKeys.get(variables.id),
      })
      queryClient.invalidateQueries({ queryKey: modKeys.all })
    },
    onError: (error) => {
      toast.error(
        (error as Error).message ||
          'Failed to update mod. Please try again later.',
      )
    },
  })
}
