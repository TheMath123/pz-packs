import { toast } from '@org/design-system/components/ui/sonner'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { ModpackService } from '@/services/modpack'
import { modpackExportConfigurationKeys } from './keys'

export function useSaveModpackExportConfiguration(modpackId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (
      data: Parameters<typeof ModpackService.saveExportConfiguration>[1],
    ) => ModpackService.saveExportConfiguration(modpackId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: modpackExportConfigurationKeys.get(modpackId),
      })
      toast.success('Export configuration saved successfully')
    },
    onError: (error) => {
      toast.error(error.message)
    },
  })
}
