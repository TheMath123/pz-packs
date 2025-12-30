import type { ModpackExportConfigurationRepository } from '@org/database/repository'

interface SaveExportConfigurationRequest {
  modpackId: string
  userId: string
  modsOrder?: string[]
  modConfig?: Record<string, { selectedSteamModIds: string[] }>
}

export class SaveExportConfigurationUseCase {
  constructor(
    private modpackExportConfigurationRepository: ModpackExportConfigurationRepository,
  ) {}

  async execute(request: SaveExportConfigurationRequest) {
    return this.modpackExportConfigurationRepository.save(request)
  }
}
