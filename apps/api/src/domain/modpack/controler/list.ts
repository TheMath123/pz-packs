import { modpackRepository } from '@org/database'
import { ApiResponse } from '@/utils'
import type { ListModpacksQuerySchema } from '../validations'

interface ListPublicModpacksControllerParams {
  query: ListModpacksQuerySchema
}

export async function listPublicModpacksController({
  query,
}: ListPublicModpacksControllerParams) {
  const result = await modpackRepository.findPublicPaginated({
    page: query.page,
    limit: query.limit,
    search: query.search,
    sortBy: query.sortBy,
    sortOrder: query.sortOrder,
  })

  return new ApiResponse(result, 200)
}
