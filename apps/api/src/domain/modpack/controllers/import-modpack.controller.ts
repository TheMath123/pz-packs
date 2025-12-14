import type { User } from '@org/auth/types'
import type { ModpackMemberRepository } from '@org/database/repository/modpack-member-repository'
import type { ModpackRepository } from '@org/database/repository/modpack-repository'
import type { ImportModpackFormData } from '@org/validation/forms/modpack/import-modpack.schema'
import { modpackImportQueue } from '@/infra/queue/modpack-import/queue'
import { ApiResponse } from '@/utils'

interface ImportModpackControllerParams {
  body: ImportModpackFormData
  params: {
    id: string // modpackId
  }
  user: User
}

export class ImportModpackController {
  constructor(
    private modpackRepository: ModpackRepository,
    private modpackMemberRepository: ModpackMemberRepository,
  ) {}

  async handle({ body, params, user }: ImportModpackControllerParams) {
    const { id: modpackId } = params
    const { steamUrl } = body

    // 1. Check permissions
    const modpack = await this.modpackRepository.findById(modpackId)
    if (!modpack) {
      return new ApiResponse({ error: { message: 'Modpack not found' } }, 404)
    }

    if (!modpack.isActive) {
      return new ApiResponse(
        { error: { message: 'Modpack is not active' } },
        401,
      )
    }

    const isOwner = modpack.owner === user.id
    let isMember = false

    if (!isOwner) {
      const member = await this.modpackMemberRepository.findMember(
        modpackId,
        user.id,
      )
      // TODO: Check specific permission like 'ADD_MOD' or 'IMPORT_MODPACK'
      if (member?.isActive) {
        isMember = true
      }
    }

    if (!isOwner && !isMember) {
      return new ApiResponse(
        {
          error: { message: 'You do not have permission to edit this modpack' },
        },
        403,
      )
    }

    try {
      const jobId = `import-modpack-${modpackId}`
      const job = await modpackImportQueue.add(
        'import-modpack',
        {
          modpackId,
          steamUrl,
          userId: user.id,
        },
        {
          jobId,
        },
      )

      return new ApiResponse(
        {
          message: 'Import started in background',
          jobId: job.id,
        },
        200,
      )
    } catch (error) {
      console.error('Failed to enqueue import job:', error)
      return new ApiResponse(
        { error: { message: 'Failed to start import process' } },
        500,
      )
    }
  }
}
