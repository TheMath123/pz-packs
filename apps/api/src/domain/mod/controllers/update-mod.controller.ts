import type { CreateModData } from '@org/database/repository/mod-repository'
import { ApiResponse } from '@/utils'
import type { UpdateModUseCase } from '../use-cases/update-mod'

interface UpdateModControllerParams {
  params: {
    id: string
  }
  body: Partial<CreateModData>
}

export class UpdateModController {
  constructor(private updateModUseCase: UpdateModUseCase) {}

  async handle({ params, body }: UpdateModControllerParams) {
    try {
      const result = await this.updateModUseCase.execute(params.id, body)
      return new ApiResponse(result, 200)
    } catch (error) {
      if (error instanceof Error && error.message === 'Mod not found') {
        return new ApiResponse({ message: 'Mod not found' }, 404)
      }
      throw error
    }
  }
}
