import type {
  ModpackExportRepository,
  ModpackModRepository,
} from '@org/database/repository'

export class GenerateServerFileUseCase {
  constructor(
    private modpackModRepository: ModpackModRepository,
    private modpackExportRepository: ModpackExportRepository,
  ) {}

  async execute(exportId: string): Promise<void> {
    const exportRequest = await this.modpackExportRepository.findById(exportId)

    if (!exportRequest) {
      throw new Error('Export request not found')
    }

    try {
      const modpackMods = await this.modpackModRepository.findByModpack(
        exportRequest.modpackId,
      )

      const mods: string[] = []
      const maps: string[] = []
      const workshopItems: string[] = []

      for (const item of modpackMods) {
        if (!item.mod) continue

        // Workshop Items
        if (item.mod.workshopId) {
          workshopItems.push(item.mod.workshopId)
        }

        // Maps
        if (item.mod.mapFolders && item.mod.mapFolders.length > 0) {
          maps.push(...item.mod.mapFolders)
        }

        // Mods
        if (item.mod.steamModId && item.mod.steamModId.length > 0) {
          if (exportRequest.version === '42x') {
            // v42 format: \ModID
            mods.push(...item.mod.steamModId.map((id) => `\\${id}`))
          } else {
            // v41 format: ModID
            mods.push(...item.mod.steamModId)
          }
        }
      }

      // Remove duplicates
      const uniqueMods = [...new Set(mods)]
      const uniqueMaps = [...new Set(maps)]
      const uniqueWorkshopItems = [...new Set(workshopItems)]

      // Format content
      const content = [
        `Mods=${uniqueMods.join(';')}`,
        `Map=${[...uniqueMaps, 'Muldraugh, KY'].join(';')}`,
        `WorkshopItems=${uniqueWorkshopItems.join(';')}`,
      ].join('\n')

      await this.modpackExportRepository.update(exportId, {
        status: 'completed',
        fileContent: content,
      })
    } catch (error) {
      await this.modpackExportRepository.update(exportId, {
        status: 'failed',
      })
      throw error
    }
  }
}
