import { useQuery } from '@tanstack/react-query'
import { ModpackService } from '@/services/modpack'
import { modpackExportConfigurationKeys } from './keys'

export function useModpackExportConfiguration(modpackId: string) {
  return useQuery({
    queryKey: modpackExportConfigurationKeys.get(modpackId),
    queryFn: () => ModpackService.getExportConfiguration(modpackId),
  })
}
