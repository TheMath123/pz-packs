import { ModpackExportConfigurationRepository } from '@org/database/repository'
import { SaveExportConfigurationController } from '../controllers/save-export-configuration.controller'
import { SaveExportConfigurationUseCase } from '../use-cases/save-export-configuration'

export function makeSaveExportConfigurationController() {
  const repository = new ModpackExportConfigurationRepository()
  const useCase = new SaveExportConfigurationUseCase(repository)
  return new SaveExportConfigurationController(useCase)
}
