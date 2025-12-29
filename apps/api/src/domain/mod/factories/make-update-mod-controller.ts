import { modRepository } from '@org/database/repository/mod-repository'
import { UpdateModController } from '../controllers/update-mod.controller'
import { UpdateModUseCase } from '../use-cases/update-mod'

export function makeUpdateModController() {
  const useCase = new UpdateModUseCase(modRepository)
  return new UpdateModController(useCase)
}
