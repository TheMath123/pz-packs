import type { User } from '@org/auth/types'
import {
  modpackMemberRepository,
  modpackModRepository,
  modpackRepository,
  modRepository,
} from '@org/database'
import type { AddModInModpackFormData } from '@org/validation/forms/mod/add-mod-in-modpack.schema'
import { steamClient } from '@/shared/steam-client'
import { ApiResponse } from '@/utils'

interface AddModControllerParams {
  body: AddModInModpackFormData
  params: {
    id: string // modpackId
  }
  user: User
}

export async function addModController({
  body,
  params,
  user,
}: AddModControllerParams) {
  const { id: modpackId } = params
  const { modAtribute } = body

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
    // TODO: Check specific permission like 'ADD_MOD'
    if (member?.isActive) {
      isMember = true
    }
  }

  if (!isOwner && !isMember) {
    return new ApiResponse(
      { error: { message: 'You do not have permission to add mods' } },
      403,
    )
  }

  // 2. Extract Workshop ID
  const workshopId = extractWorkshopId(modAtribute.toString())
  if (!workshopId) {
    return new ApiResponse(
      { error: { message: 'Invalid Workshop ID or URL' } },
      400,
    )
  }

  // 3. Process Mod (Recursive)
  const processedWorkshopIds = new Set<string>()
  const addedMods: string[] = []

  try {
    await processMod(workshopId, modpackId, processedWorkshopIds, addedMods)
  } catch (error) {
    console.error('Error processing mod:', error)
    return new ApiResponse(
      { error: { message: 'Failed to process mod', details: error } },
      500,
    )
  }

  return new ApiResponse(
    {
      message: 'Mod added successfully',
      addedModsCount: addedMods.length,
      addedMods,
    },
    201,
  )
}

function extractWorkshopId(input: string): string | null {
  if (/^\d+$/.test(input)) return input
  try {
    const url = new URL(input)
    return url.searchParams.get('id')
  } catch {
    const match = input.match(/id=(\d+)/)
    return match ? match[1] : null
  }
}

async function processMod(
  workshopId: string,
  modpackId: string,
  processedWorkshopIds: Set<string>,
  addedMods: string[],
): Promise<string | null> {
  if (processedWorkshopIds.has(workshopId)) return null
  processedWorkshopIds.add(workshopId)

  // Check if mod exists in DB
  let mod = await modRepository.findByWorkshopId(workshopId)

  if (!mod) {
    // Fetch from Steam
    const steamDetails = await steamClient.querySteamWorkshopFiles(workshopId)
    const scrapedInfo = await steamClient.scrapeWorkshopPage(workshopId)

    if (!steamDetails && !scrapedInfo.title) {
      console.warn(`Mod ${workshopId} not found on Steam`)
      return null
    }

    const title = steamDetails?.title || scrapedInfo.title || 'Unknown Mod'
    const description = steamDetails?.description || scrapedInfo.description
    const image = steamDetails?.preview_url || scrapedInfo.imageURL

    // Handle modId (can be multiple)
    const modIdStr = scrapedInfo.mod_id
      ? scrapedInfo.mod_id.join(',')
      : 'unknown'

    // Create mod
    mod = await modRepository.create({
      name: title,
      steamModId: modIdStr,
      workshopId: workshopId,
      mapFolders: scrapedInfo.map_folder || [],
      requiredMods: scrapedInfo.modsRequirements
        .map((r) => r.id)
        .filter((id): id is string => !!id),
      description: description,
      steamUrl: `https://steamcommunity.com/sharedfiles/filedetails/?id=${workshopId}`,
      avatarUrl: image,
      highlights: [],
    })
  }

  // Add to modpack if not exists
  const existsInModpack = await modpackModRepository.exists(modpackId, mod.id)
  if (!existsInModpack) {
    await modpackModRepository.addMod({ modpackId, modId: mod.id })
    addedMods.push(mod.name)
  }

  // Process requirements
  if (mod.requiredMods && mod.requiredMods.length > 0) {
    for (const reqWorkshopId of mod.requiredMods) {
      if (reqWorkshopId) {
        await processMod(
          reqWorkshopId,
          modpackId,
          processedWorkshopIds,
          addedMods,
        )
      }
    }
  }

  return mod.id
}
