import { toast } from '@org/design-system/components/ui/sonner'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { ModpackImportService } from '@/services/modpack/import'

interface ImportModpackParams {
  modpackId: string
  steamUrl: string
}

export function useImportModpack() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ modpackId, steamUrl }: ImportModpackParams) =>
      ModpackImportService.import({ id: modpackId, data: { steamUrl } }),
    onSuccess: (data, variables) => {
      toast.success(data.message || 'Import started in background')
      queryClient.invalidateQueries({
        queryKey: ['import-modpack-status', variables.modpackId],
      })
    },
    onError: (error) => {
      toast.error(
        (error as Error).message ||
          'Failed to start import. Please try again later.',
      )
    },
  })
}
