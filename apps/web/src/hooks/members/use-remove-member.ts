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
      // Invalidate members list and modpack detail
      queryClient.invalidateQueries({
        queryKey: modpackKeys.members(variables.modpackId),
      })
      queryClient.invalidateQueries({
        queryKey: modpackKeys.detail(variables.modpackId),
      })
    },
  })
}
