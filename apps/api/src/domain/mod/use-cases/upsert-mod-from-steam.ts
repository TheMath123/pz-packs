import type { ModRepository } from '@org/database/repository/mod-repository'
import type { TagRepository } from '@org/database/repository/tag-repository'
import type { SteamClient } from '@/shared/steam-client'

export class UpsertModFromSteamUseCase {
  constructor(
    private modRepository: ModRepository,
    private tagRepository: TagRepository,
    private steamClient: SteamClient,
  ) {}

  async execute(workshopId: string, options: { forceUpdate?: boolean } = {}) {
    // Check if mod exists in DB
    let mod = await this.modRepository.findByWorkshopId(workshopId)

    if (mod && !options.forceUpdate) {
      return mod
    }

    // Fetch from Steam
    const steamDetails =
      await this.steamClient.querySteamWorkshopFiles(workshopId)
    const scrapedInfo = await this.steamClient.scrapeWorkshopPage(workshopId)

    if (!steamDetails && !scrapedInfo.title) {
      console.warn(`Mod ${workshopId} not found on Steam`)
      return null
    }

    if (steamDetails && steamDetails.file_type !== 0) {
      throw new Error(`Workshop item ${workshopId} not a mod.`)
    }

    if (scrapedInfo.isCollection) {
      throw new Error(`Workshop item ${workshopId} not a mod.`)
    }

    const title =
      steamDetails?.title || scrapedInfo.title || mod?.name || 'Unknown Mod'
    const description =
      steamDetails?.file_description ||
      scrapedInfo.description ||
      scrapedInfo.rawDescription?.replace(/<[^>]*>?/gm, '') ||
      mod?.description
    const image =
      steamDetails?.preview_url || scrapedInfo.imageURL || mod?.avatarUrl

    // Handle Tags
    const tagIds: string[] = []
    if (steamDetails?.tags) {
      for (const tagObj of steamDetails.tags) {
        const tag = await this.tagRepository.findOrCreate(tagObj.tag)
        tagIds.push(tag.id)
      }
    }

    // Handle Highlights
    const highlights: string[] = []
    if (steamDetails?.previews) {
      highlights.push(
        ...steamDetails.previews
          .filter((p) => p.preview_type === 0)
          .map((p) => p.url),
      )
    }

    // Handle modId (can be multiple)
    const modIds = scrapedInfo.mod_id || mod?.steamModId || ['unknown']

    const modData = {
      name: title,
      steamModId: modIds,
      workshopId: workshopId,
      mapFolders: scrapedInfo.map_folder || mod?.mapFolders || [],
      requiredMods: scrapedInfo.modsRequirements
        .map((r) => r.id)
        .filter((id): id is string => !!id),
      description: description || 'No description provided.',
      steamUrl: `https://steamcommunity.com/sharedfiles/filedetails/?id=${workshopId}`,
      avatarUrl: image || undefined,
      highlights: highlights.length > 0 ? highlights : mod?.highlights || [],
      tags: tagIds.length > 0 ? tagIds : mod?.tags.map((t) => t.id) || [],
    }

    if (mod) {
      mod = await this.modRepository.update(mod.id, modData)
    } else {
      mod = await this.modRepository.create(modData)
    }

    return mod
  }
}
