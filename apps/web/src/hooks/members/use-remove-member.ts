import { toast } from '@org/design-system/components/ui/sonner'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { ModpackService } from '@/services/modpack'
import { modpackKeys } from '../modpack/modpack-keys'

interface RemoveMemberParams {
  modpackId: string
  email: string
}

export function useRemoveModpackMember() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ modpackId, email }: RemoveMemberParams) =>
      ModpackService.removeMember(modpackId, email),
    onSuccess: (_, variables) => {
      toast.success('Member removed successfully')
      queryClient.invalidateQueries({
        queryKey: modpackKeys.members(variables.modpackId),
      })
      queryClient.invalidateQueries({
        queryKey: modpackKeys.detail(variables.modpackId),
      })
    },
    onError: (error) => {
      toast.error(
        (error as Error).message ||
          'Failed to remove member. Please try again later.',
      )
    },
  })
}
