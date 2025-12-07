import { archiveModpackService } from './archive-modpack.service'
import { createModpackService } from './create-modpack.service'
import { getModpackByIdService } from './get-modpack-by-id.service'
import { getMyModpacksService } from './get-my-modpacks.service'
import { getPublicModpacksService } from './get-public-modpacks.service'
import { updateModpackService } from './update-modpack.service'

export const ModpackService = {
  create: createModpackService,
  getById: getModpackByIdService,
  getMyModpacks: getMyModpacksService,
  getPublicModpacks: getPublicModpacksService,
  update: updateModpackService,
  archive: archiveModpackService,
}
