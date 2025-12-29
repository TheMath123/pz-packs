import { ApiResponse } from '@/utils'
import type { UpdateAllModsUseCase } from '../use-cases/update-all-mods'

interface UpdateAllModsControllerParams {
  user: {
    id: string
  }
}

export class UpdateAllModsController {
  constructor(private updateAllModsUseCase: UpdateAllModsUseCase) {}

  async handle({ user }: UpdateAllModsControllerParams) {
    const result = await this.updateAllModsUseCase.execute()
    return new ApiResponse(result, 200)
  }
}
