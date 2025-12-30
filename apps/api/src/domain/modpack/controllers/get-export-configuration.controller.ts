import type { GetExportConfigurationUseCase } from '../use-cases/get-export-configuration'

export class GetExportConfigurationController {
  constructor(private useCase: GetExportConfigurationUseCase) {}

  async handle(request: { params: { id: string }; user: { id: string } }) {
    const result = await this.useCase.execute({
      modpackId: request.params.id,
      userId: request.user.id,
    })

    return {
      status: 200,
      value: result,
    }
  }
}
