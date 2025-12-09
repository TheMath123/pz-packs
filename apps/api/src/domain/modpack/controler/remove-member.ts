import type { User } from '@org/auth/types'
import { modpackMemberRepository, modpackRepository } from '@org/database'
import { ApiResponse } from '@/utils'
import type { ModpackIdParam, RemoveMemberSchema } from '../validations'

interface RemoveMemberControllerParams {
  params: ModpackIdParam
  body: RemoveMemberSchema
  user: User
}

export async function removeMemberController({
  params,
  body,
  user,
}: RemoveMemberControllerParams) {
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
          message: 'Only the owner can remove members from this modpack',
        },
      },
      403,
    )
  }

  // Check if member exists
  const member = await modpackMemberRepository.findByEmailMember(
    params.id,
    body.email,
  )
  if (!member) {
    return new ApiResponse(
      {
        error: {
          message: 'User is not a member of this modpack',
        },
      },
      404,
    )
  }

  await modpackMemberRepository.removeMemberByEmail(params.id, body.email)

  return new ApiResponse(
    {
      message: 'Member removed successfully',
    },
    200,
  )
}
