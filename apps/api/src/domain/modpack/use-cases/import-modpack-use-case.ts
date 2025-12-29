import { steamClient } from '@/shared/steam-client'
import type { AddModToModpackUseCase } from './add-mod-to-modpack'

export class ImportModpackUseCase {
  constructor(private addModToModpackUseCase: AddModToModpackUseCase) {}

  async execute(
    modpackId: string,
    steamUrl: string,
  ): Promise<{ addedMods: string[]; errors: string[] }> {
    const urlParams = new URL(steamUrl)
    const workshopId = urlParams.searchParams.get('id')

    if (!workshopId) {
      throw new Error('Invalid Steam URL')
    }

    const scrapedInfo = await steamClient.scrapeWorkshopPage(workshopId)

    if (!scrapedInfo.isCollection) {
      throw new Error('The provided URL is not a Steam Collection')
    }

    const addedMods: string[] = []
    const errors: string[] = []
    const processedWorkshopIds = new Set<string>()

    if (scrapedInfo.collectionItems) {
      for (const modWorkshopId of scrapedInfo.collectionItems) {
        try {
          const resultAddedMods: string[] = []
          await this.addModToModpackUseCase.execute(
            modWorkshopId,
            modpackId,
            processedWorkshopIds,
            resultAddedMods,
          )
          addedMods.push(...resultAddedMods)
        } catch (error) {
          errors.push(
            `Failed to add mod ${modWorkshopId}: ${error instanceof Error ? error.message : 'Unknown error'}`,
          )
        }
      }
    }

    return { addedMods, errors }
  }
}
