import type {
  CreateModData,
  ModRepository,
} from '@org/database/repository/mod-repository'

export class UpdateModUseCase {
  constructor(private modRepository: ModRepository) {}

  async execute(id: string, data: Partial<CreateModData>) {
    const mod = await this.modRepository.update(id, data)
    if (!mod) {
      throw new Error('Mod not found')
    }
    return mod
  }
}
