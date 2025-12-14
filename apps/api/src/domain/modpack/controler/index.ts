import { addMemberController } from './add-member'
import { archiveModpackController } from './archive'
import { getModpackByIdController } from './get-by-id'
import { getPublicModpackByIdController } from './get-public-by-id'
import { listMembersController } from './list-members'
import { listModsController } from './list-mods'
import { listMyModpacksController } from './list-my'
import { removeMemberController } from './remove-member'
import { removeModController } from './remove-mod'
import { updateModpackController } from './update'

export const modpackController = {
  update: updateModpackController,
  archive: archiveModpackController,
  listMy: listMyModpacksController,
  getById: getModpackByIdController,
  getPublicById: getPublicModpackByIdController,
  addMember: addMemberController,
  removeMember: removeMemberController,
  listMembers: listMembersController,
  listMods: listModsController,
  removeMod: removeModController,
}
