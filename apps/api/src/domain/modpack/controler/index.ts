import { addMemberController } from './add-member'
import { addModController } from './add-mod'
import { archiveModpackController } from './archive'
import { createModpackController } from './create'
import { getModpackByIdController } from './get-by-id'
import { listPublicModpacksController } from './list'
import { listMembersController } from './list-members'
import { listModsController } from './list-mods'
import { listMyModpacksController } from './list-my'
import { removeMemberController } from './remove-member'
import { updateModpackController } from './update'
import { removeModController } from './remove-mod'

export const modpackController = {
  create: createModpackController,
  update: updateModpackController,
  archive: archiveModpackController,
  listPublic: listPublicModpacksController,
  listMy: listMyModpacksController,
  getById: getModpackByIdController,
  addMember: addMemberController,
  removeMember: removeMemberController,
  listMembers: listMembersController,
  addMod: addModController,
  listMods: listModsController,
  removeMod: removeModController,
}
