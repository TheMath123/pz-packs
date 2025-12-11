import { archiveModpackService } from './archive-modpack.service'
import { createModpackService } from './create-modpack.service'
import { getModpackMembersService } from './get-members.service'
import { getModpackByIdService } from './get-modpack-details.service'
import { getMyModpacksService } from './get-my-modpacks.service'
import { getPublicModpacksService } from './get-public-modpacks.service'
import { addModpackMemberService } from './members/add-member.service'
import { removeModpackMemberService } from './members/remove-member.service'
import { updateModpackService } from './update-modpack.service'

export const ModpackService = {
  create: createModpackService,
  getById: getModpackByIdService,
  getMembers: getModpackMembersService,
  getMyModpacks: getMyModpacksService,
  getPublicModpacks: getPublicModpacksService,
  update: updateModpackService,
  archive: archiveModpackService,
  addMember: addModpackMemberService,
  removeMember: removeModpackMemberService,
}
