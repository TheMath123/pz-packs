import { archiveModpackService } from './archive-modpack.service'
import { createModpackService } from './create-modpack.service'
import { downloadServerFile } from './download-server-file.service'
import { requestServerFile } from './export-server-file.service'
import { getExportConfigurationService } from './get-export-configuration.service'
import { getModpackService } from './get-modpack.service'
import { getPublicModpackService } from './get-public-modpack.service'
import { listMyModpacksService } from './list-my-modpacks.service'
import { listPublicModpacksService } from './list-public-modpacks.service'
import { saveExportConfigurationService } from './save-export-configuration.service'
import { updateModpackService } from './update-modpack.service'

export const ModpackService = {
  create: createModpackService,
  get: getModpackService,
  getPublic: getPublicModpackService,
  listMyModpacks: listMyModpacksService,
  listPublicModpacks: listPublicModpacksService,
  update: updateModpackService,
  archive: archiveModpackService,
  export: requestServerFile,
  download: downloadServerFile,
  getExportConfiguration: getExportConfigurationService,
  saveExportConfiguration: saveExportConfigurationService,
}
