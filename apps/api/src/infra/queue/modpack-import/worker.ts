import { Worker } from 'bullmq'
import { makeImportModpackUseCase } from '@/domain/modpack/factories/make-import-modpack-use-case'
import { connection } from '../connection'
import { notificationQueue } from '../notification/queue'
import { MODPACK_IMPORT_QUEUE_NAME, type ModpackImportJobData } from './queue'

export const modpackImportWorker = new Worker<ModpackImportJobData>(
  MODPACK_IMPORT_QUEUE_NAME,
  async (job) => {
    console.log(
      `[ModpackImportWorker] Processing job ${job.id} for modpack ${job.data.modpackId}`,
    )

    try {
      const importModpackUseCase = makeImportModpackUseCase()
      const result = await importModpackUseCase.execute(
        job.data.modpackId,
        job.data.steamUrl,
      )

      console.log(
        `[ModpackImportWorker] Job ${job.id} completed. Added ${result.addedMods.length} mods.`,
      )

      // Notify success
      await notificationQueue.add('import-success', {
        userId: job.data.userId,
        title: 'Modpack Import Completed',
        content: `Successfully imported ${result.addedMods.length} mods to your modpack.`,
        type: 'success',
        metadata: JSON.stringify({ modpackId: job.data.modpackId }),
      })

      if (result.errors.length > 0) {
        console.warn(
          `[ModpackImportWorker] Job ${job.id} had errors:`,
          result.errors,
        )

        // Notify partial errors if needed
        await notificationQueue.add('import-warning', {
          userId: job.data.userId,
          title: 'Modpack Import Completed with Warnings',
          content: `Imported ${result.addedMods.length} mods, but ${result.errors.length} mods failed.`,
          type: 'warning',
          metadata: JSON.stringify({
            modpackId: job.data.modpackId,
            errors: result.errors,
          }),
        })
      }

      return result
    } catch (error) {
      console.error(`[ModpackImportWorker] Job ${job.id} failed:`, error)

      // Notify failure
      await notificationQueue.add('import-error', {
        userId: job.data.userId,
        title: 'Modpack Import Failed',
        content: `Failed to import mods: ${error instanceof Error ? error.message : 'Unknown error'}`,
        type: 'error',
        metadata: JSON.stringify({ modpackId: job.data.modpackId }),
      })

      throw error
    }
  },
  {
    connection,
    concurrency: 5, // Processar até 5 importações simultaneamente
  },
)

modpackImportWorker.on('completed', (job) => {
  console.log(`[ModpackImportWorker] Job ${job.id} has completed!`)
})

modpackImportWorker.on('failed', (job, err) => {
  console.error(
    `[ModpackImportWorker] Job ${job?.id} has failed with ${err.message}`,
  )
})
