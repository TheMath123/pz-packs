import { type Job, Worker } from 'bullmq'
import { connection } from './connection'
import { APP_QUEUE_NAME } from './instance'
import { modpackImportProcessor } from './processors/modpack-import'
import { notificationProcessor } from './processors/notification'
import { serverFileGenerationProcessor } from './processors/server-file-generation'
import { updateAllModsProcessor } from './processors/update-all-mods'

export const appWorker = new Worker(
  APP_QUEUE_NAME,
  async (job: Job) => {
    // Handle notification jobs (they have various names)
    if (
      [
        'import-success',
        'import-warning',
        'import-error',
        'server-file-ready',
        'server-file-error',
      ].includes(job.name)
    ) {
      return notificationProcessor(job)
    }

    switch (job.name) {
      case 'import-modpack': // Name used in import-modpack.controller.ts
        return modpackImportProcessor(job)
      case 'generate-server-file': // Name used in request-server-file.ts
        return serverFileGenerationProcessor(job)
      case 'update-all-mods':
        return updateAllModsProcessor(job)
      default:
      // handle unknown job types if necessary
    }
  },
  {
    connection,
    concurrency: 10, // Global concurrency for this worker instance
  },
)
