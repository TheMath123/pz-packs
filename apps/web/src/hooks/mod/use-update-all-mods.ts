import { toast } from '@org/design-system/components/ui/sonner'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { ModService } from '@/services/mod'
import { modKeys } from './mod-keys'

export function useUpdateAllMods() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async () => await ModService.updateAll(),
    onSuccess: () => {
      toast.success('Request to update all mods sent successfully')
      queryClient.invalidateQueries({
        queryKey: modKeys.all,
      })
    },
    onError: (error) => {
      toast.error(
        (error as Error).message ||
          'Failed to update mod. Please try again later.',
      )
    },
  })
}
