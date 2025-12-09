import type { User } from '@org/auth/types'
import { modpackRepository } from '@org/database'
import { ApiResponse } from '@/utils'
import type { ListModpacksQuerySchema } from '../validations'

interface ListMyModpacksControllerParams {
  query: ListModpacksQuerySchema
  user: User
}

export async function listMyModpacksController({
  query,
  user,
}: ListMyModpacksControllerParams) {
  const result = await modpackRepository.findByUserPaginated(user.id, {
    page: query.page,
    limit: query.limit,
    search: query.search,
    sortBy: query.sortBy,
    sortOrder: query.sortOrder,
  })

  return new ApiResponse(result, 200)
}
