import { UpdateAllModsController } from '../controllers/update-all-mods.controller'
import { UpdateAllModsUseCase } from '../use-cases/update-all-mods'

export function makeUpdateAllModsController() {
  const useCase = new UpdateAllModsUseCase()
  return new UpdateAllModsController(useCase)
}
