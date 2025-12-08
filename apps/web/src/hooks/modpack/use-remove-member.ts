import { useMutation, useQueryClient } from '@tanstack/react-query'
import { ModpackService } from '@/services/modpack'
import { modpackKeys } from './modpack-keys'

interface RemoveMemberParams {
  modpackId: string
  memberId: string
}

export function useRemoveModpackMember() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ modpackId, memberId }: RemoveMemberParams) =>
      ModpackService.removeMember(modpackId, memberId),
    onSuccess: (_, variables) => {
      // Invalidate specific modpack detail to refresh members list
      queryClient.invalidateQueries({
        queryKey: modpackKeys.detail(variables.modpackId),
      })
    },
  })
}
