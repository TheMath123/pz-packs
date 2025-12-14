import { getImportStatusService } from './get-import-status.service'
import { importModpackService } from './import-modpack.service'

export const ModpackImportService = {
  import: importModpackService,
  getImportStatus: getImportStatusService,
}
