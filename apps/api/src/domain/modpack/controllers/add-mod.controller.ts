import type { User } from '@org/auth/types'
import type { ModpackMemberRepository } from '@org/database/repository/modpack-member-repository'
import type { ModpackRepository } from '@org/database/repository/modpack-repository'
import type { AddModInModpackFormData } from '@org/validation/forms/mod/add-mod-in-modpack.schema'
import { ApiResponse, extractWorkshopId } from '@/utils'
import type { AddModToModpackUseCase } from '../use-cases/add-mod-to-modpack'

interface AddModControllerParams {
  body: AddModInModpackFormData
  params: {
    id: string // modpackId
  }
  user: User
}

export class AddModController {
  constructor(
    private modpackRepository: ModpackRepository,
    private modpackMemberRepository: ModpackMemberRepository,
    private addModToModpackUseCase: AddModToModpackUseCase,
  ) {}

  async handle({ body, params, user }: AddModControllerParams) {
    const { id: modpackId } = params
    const { modAtribute } = body

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
      if (member?.isActive) {
        isMember = true
      }
    }

    if (!isOwner && !isMember) {
      return new ApiResponse(
        { error: { message: 'You do not have permission to add mods' } },
        403,
      )
    }

    // 2. Extract Workshop ID
    const workshopId = extractWorkshopId(modAtribute)
    if (!workshopId) {
      return new ApiResponse(
        { error: { message: 'Invalid Steam Workshop URL or ID' } },
        400,
      )
    }

    // 3. Add Mod (and requirements)
    const addedMods: string[] = []
    try {
      await this.addModToModpackUseCase.execute(
        workshopId,
        modpackId,
        new Set(),
        addedMods,
      )
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Unknown error'
      return new ApiResponse({ error: { message } }, 400)
    }

    return new ApiResponse(
      {
        message: 'Mods added successfully',
        addedMods,
      },
      200,
    )
  }
}
