import type { User } from '@org/auth/types'
import { modpackRepository } from '@org/database'
import { ApiResponse } from '@/utils'
import type { ModpackIdParam, UpdateModpackSchema } from '../validations'

interface UpdateModpackControllerParams {
  params: ModpackIdParam
  body: UpdateModpackSchema
  user: User
}

export async function updateModpackController({
  params,
  body,
  user,
}: UpdateModpackControllerParams) {
  const modpack = await modpackRepository.findById(params.id)

  if (!modpack) {
    return new ApiResponse(
      {
        error: {
          message: 'Modpack not found',
        },
      },
      404,
    )
  }

  // Check if user is the owner
  if (modpack.owner !== user.id) {
    return new ApiResponse(
      {
        error: {
          message: 'Only the owner can update this modpack',
        },
      },
      403,
    )
  }

  const data = await modpackRepository.update(params.id, {
    name: body.name,
    description: body.description,
    avatarUrl: body.avatarUrl,
    isPublic: body.isPublic,
    steamUrl: body.steamWorkshopUrl,
  })

  return new ApiResponse(data, 200)
}
