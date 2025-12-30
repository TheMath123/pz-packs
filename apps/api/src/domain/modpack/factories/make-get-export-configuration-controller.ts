import { ModpackExportConfigurationRepository } from '@org/database/repository'
import { GetExportConfigurationController } from '../controllers/get-export-configuration.controller'
import { GetExportConfigurationUseCase } from '../use-cases/get-export-configuration'

export function makeGetExportConfigurationController() {
  const repository = new ModpackExportConfigurationRepository()
  const useCase = new GetExportConfigurationUseCase(repository)
  return new GetExportConfigurationController(useCase)
}
