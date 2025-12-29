import { ModpackRepository } from '@org/database'
import type { Job } from 'bullmq'
import { makeImportModpackUseCase } from '@/domain/modpack/factories/make-import-modpack-use-case'
import type { ModpackImportJobData } from '../modpack-import/queue'
import { notificationQueue } from '../notification/queue'

export const modpackImportProcessor = async (
  job: Job<ModpackImportJobData>,
) => {
  try {
    const modpackRepository = new ModpackRepository()
    const modpack = await modpackRepository.findById(job.data.modpackId)
    const modpackName = modpack?.name || 'Unknown Modpack'

    const importModpackUseCase = makeImportModpackUseCase()
    const result = await importModpackUseCase.execute(
      job.data.modpackId,
      job.data.steamUrl,
    )

    // Notify success
    await notificationQueue.add('import-success', {
      userId: job.data.userId,
      title: `Modpack Import Completed`,
      content: `Successfully imported ${result.addedMods.length} mods to "${modpackName}".`,
      type: 'success',
      metadata: JSON.stringify({ modpackId: job.data.modpackId }),
    })

    if (result.errors.length > 0) {
      // Notify partial errors if needed
      await notificationQueue.add('import-warning', {
        userId: job.data.userId,
        title: 'Modpack Import Completed with Warnings',
        content: `Imported ${result.addedMods.length} mods to "${modpackName}", but ${result.errors.length} mods failed.`,
        type: 'warning',
        metadata: JSON.stringify({
          modpackId: job.data.modpackId,
          errors: result.errors,
        }),
      })
    }

    return result
  } catch (error) {
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
}
