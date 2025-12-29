import { useMutation } from '@tanstack/react-query'
import { updateAllModsService } from '@/services/mod/update-all-mods.service'

export function useUpdateAllMods() {
  return useMutation({
    mutationFn: updateAllModsService,
  })
}
