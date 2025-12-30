import type { ModpackExportConfigurationRepository } from '@org/database/repository'

interface GetExportConfigurationRequest {
  modpackId: string
  userId: string
}

export class GetExportConfigurationUseCase {
  constructor(
    private modpackExportConfigurationRepository: ModpackExportConfigurationRepository,
  ) {}

  async execute(request: GetExportConfigurationRequest) {
    return this.modpackExportConfigurationRepository.findByModpackAndUser(
      request.modpackId,
      request.userId,
    )
  }
}
