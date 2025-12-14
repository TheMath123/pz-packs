import { getModService } from './get-mod.service'
import { listModsService } from './list-mods.service'

export const ModService = {
  get: getModService,
  list: listModsService,
}
