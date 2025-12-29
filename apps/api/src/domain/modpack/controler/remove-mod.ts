import type { User } from '@org/auth/types'
import {
  modpackMemberRepository,
  modpackModRepository,
  modpackRepository,
  modRepository,
} from '@org/database'
import { ApiResponse } from '@/utils'

interface RemoveModControllerParams {
  params: {
    id: string
    modId: string
  }
  user: User
}

export async function removeModController({
  params,
  user,
}: RemoveModControllerParams) {
  const { id: modpackId, modId } = params

  // 1. Check permissions
  const modpack = await modpackRepository.findById(modpackId)
  if (!modpack) {
    return new ApiResponse({ error: { message: 'Modpack not found' } }, 404)
  }

  if (!modpack.isActive) {
    return new ApiResponse({ error: { message: 'Modpack is not active' } }, 401)
  }

  const isOwner = modpack.owner === user.id
  let isMember = false

  if (!isOwner) {
    const member = await modpackMemberRepository.findMember(modpackId, user.id)
    if (member?.isActive) {
      isMember = true
    }
  }

  if (!isOwner && !isMember) {
    return new ApiResponse(
      { error: { message: 'You do not have permission to remove mods' } },
      403,
    )
  }

  // 2. Resolve Mod (UUID or WorkshopID)
  const mod = await modRepository.findById(modId)

  if (!mod) {
    return new ApiResponse({ error: { message: 'Mod not found' } }, 404)
  }

  // 3. Check if mod exists in modpack
  const exists = await modpackModRepository.exists(modpackId, mod.id)
  if (!exists) {
    return new ApiResponse(
      { error: { message: 'Mod not found in modpack' } },
      404,
    )
  }

  // 4. Analyze dependencies to remove
  const allModpackMods = await modpackModRepository.findByModpack(modpackId)

  // Check if the target mod is required by any other mod in the modpack
  const requiredBy = allModpackMods.filter((m) =>
    m.mod.requiredMods?.includes(mod.workshopId),
  )

  if (requiredBy.length > 0) {
    const names = requiredBy.map((m) => m.mod.name).join(', ')
    return new ApiResponse(
      {
        error: {
          message: `Cannot remove mod because it is required by other mods: ${names}`,
        },
      },
      400,
    )
  }

  const modsToRemove = new Set<string>()
  modsToRemove.add(mod.id)

  // Helper to get Mod ID (UUID) from Workshop ID
  const getModId = (workshopId: string) =>
    allModpackMods.find((m) => m.mod.workshopId === workshopId)?.modId

  // Recursive function to find orphans
  const findOrphans = (currentModId: string) => {
    const currentMod = allModpackMods.find(
      (modInModpack) => modInModpack.modId === currentModId,
    )?.mod
    if (!currentMod || !currentMod.requiredMods) return

    for (const reqWorkshopId of currentMod.requiredMods) {
      if (!reqWorkshopId) continue

      const reqModId = getModId(reqWorkshopId)
      if (!reqModId) continue // Dependency not in modpack (shouldn't happen if consistent)

      // Check if any OTHER mod (not currently marked for removal) uses this dependency
      const isUsed = allModpackMods.some((modInModpack) => {
        if (modsToRemove.has(modInModpack.modId)) return false // Ignore mods being removed
        return modInModpack.mod.requiredMods?.includes(reqWorkshopId)
      })

      if (!isUsed) {
        if (!modsToRemove.has(reqModId)) {
          modsToRemove.add(reqModId)
          // Recursively check if this removal creates new orphans
          findOrphans(reqModId)
        }
      }
    }
  }

  findOrphans(mod.id)

  // 4. Perform removal
  const removedModsNames: string[] = []
  for (const idToRemove of modsToRemove) {
    await modpackModRepository.removeMod(modpackId, idToRemove)
    const name = allModpackMods.find((m) => m.modId === idToRemove)?.mod.name
    if (name) removedModsNames.push(name)
  }

  return new ApiResponse(
    {
      message: 'Mod removed successfully',
      removedModsCount: modsToRemove.size,
      removedMods: removedModsNames,
    },
    200,
  )
}
