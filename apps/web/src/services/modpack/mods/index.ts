import { addModToModpackService } from './add-mod.service'
import { listModpackModsService } from './list-mods.service'
import { removeModFromModpackService } from './remove-mod.service'

export const ModpackModsService = {
  list: listModpackModsService,
  add: addModToModpackService,
  remove: removeModFromModpackService,
}
