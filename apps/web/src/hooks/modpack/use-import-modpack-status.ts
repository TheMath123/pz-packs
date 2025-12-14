import { useQuery } from '@tanstack/react-query'
import { ModpackImportService } from '@/services/modpack/import'

export function useImportModpackStatus(modpackId: string) {
  return useQuery({
    queryKey: ['import-modpack-status', modpackId],
    queryFn: () => ModpackImportService.getImportStatus(modpackId),
    refetchInterval: (query) => {
      const status = query.state.data?.status
      if (status === 'active' || status === 'waiting' || status === 'delayed') {
        return 2000 // Poll every 2 seconds
      }
      return false // Stop polling
    },
  })
}
