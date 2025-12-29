import { modpackImportQueue } from '@/infra/queue/modpack-import/queue'
import { ApiResponse } from '@/utils'

interface GetImportModpackStatusControllerParams {
  params: {
    id: string // modpackId
  }
}

export class GetImportModpackStatusController {
  async handle({ params }: GetImportModpackStatusControllerParams) {
    const { id: modpackId } = params
    const jobId = `import-modpack-${modpackId}`

    const job = await modpackImportQueue.getJob(jobId)

    if (!job) {
      return new ApiResponse({ status: 'idle' }, 200)
    }

    const state = await job.getState()

    // If it's finished, we might want to return the result or error
    let result = null
    let error = null

    if (await job.isCompleted()) {
      try {
        result = job.returnvalue
      } catch (_e) {
        // If there's an error retrieving the return value, we can log it
      }
    }

    if (await job.isFailed()) {
      error = job.failedReason
    }

    return new ApiResponse(
      {
        status: state,
        progress: job.progress,
        result,
        error,
      },
      200,
    )
  }
}
