import { createModpackController } from './create'
import { listPublicModpacksController } from './list'
import { listMyModpacksController } from './list-my'

export const modpackController = {
  create: createModpackController,
  listPublic: listPublicModpacksController,
  listMy: listMyModpacksController,
}
