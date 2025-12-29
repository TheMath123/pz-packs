import type { Job } from 'bullmq'
import { makeGenerateServerFileUseCase } from '@/domain/modpack/factories/make-generate-server-file-use-case'
import { notificationQueue } from '../notification/queue'
import type { ServerFileGenerationJobData } from '../server-file-generation/queue'

export const serverFileGenerationProcessor = async (
  job: Job<ServerFileGenerationJobData>,
) => {
  try {
    const generateServerFileUseCase = makeGenerateServerFileUseCase()
    await generateServerFileUseCase.execute(job.data.exportId)

    // Notify success
    await notificationQueue.add('server-file-ready', {
      userId: job.data.userId,
      title: 'Server File Ready',
      content: 'Your server configuration file is ready for download.',
      type: 'success',
      metadata: JSON.stringify({
        exportId: job.data.exportId,
        modpackId: job.data.modpackId,
        action: 'download-server-file',
      }),
    })
  } catch (error) {
    // Notify error
    await notificationQueue.add('server-file-error', {
      userId: job.data.userId,
      title: 'Server File Generation Failed',
      content: 'An error occurred while generating your server file.',
      type: 'error',
      metadata: JSON.stringify({
        modpackId: job.data.modpackId,
      }),
    })

    throw error
  }
}
