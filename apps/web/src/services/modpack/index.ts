import { archiveModpackService } from './archive-modpack.service'
import { createModpackService } from './create-modpack.service'
import { getModpackService } from './get-modpack.service'
import { getPublicModpackService } from './get-public-modpack.service'
import { listMyModpacksService } from './list-my-modpacks.service'
import { listPublicModpacksService } from './list-public-modpacks.service'
import { updateModpackService } from './update-modpack.service'

export const ModpackService = {
  create: createModpackService,
  get: getModpackService,
  getPublic: getPublicModpackService,
  listMyModpacks: listMyModpacksService,
  listPublicModpacks: listPublicModpacksService,
  update: updateModpackService,
  archive: archiveModpackService,
}
