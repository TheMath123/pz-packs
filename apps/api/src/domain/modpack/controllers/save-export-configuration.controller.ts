import type { SaveExportConfigurationUseCase } from '../use-cases/save-export-configuration'

export class SaveExportConfigurationController {
  constructor(private useCase: SaveExportConfigurationUseCase) {}

  async handle(request: {
    params: { id: string }
    body: {
      modsOrder?: string[]
      modConfig?: Record<string, { selectedSteamModIds: string[] }>
    }
    user: { id: string }
  }) {
    const result = await this.useCase.execute({
      modpackId: request.params.id,
      userId: request.user.id,
      modsOrder: request.body.modsOrder,
      modConfig: request.body.modConfig,
    })

    return {
      status: 200,
      value: result,
    }
  }
}
