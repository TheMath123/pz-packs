import { appQueue } from '@/infra/queue/instance'

export class UpdateAllModsUseCase {
  async execute() {
    await appQueue.add('update-all-mods', {})
    return { message: 'Update all mods job started' }
  }
}
