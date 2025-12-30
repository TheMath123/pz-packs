import type {
  ModpackExportConfigurationRepository,
  ModpackExportRepository,
  ModpackModRepository,
  ModpackRepository,
} from '@org/database/repository'

export class GenerateServerFileUseCase {
  constructor(
    private modpackModRepository: ModpackModRepository,
    private modpackExportRepository: ModpackExportRepository,
    private modpackRepository: ModpackRepository,
    private modpackExportConfigurationRepository: ModpackExportConfigurationRepository,
  ) {}

  async execute(exportId: string): Promise<void> {
    const exportRequest = await this.modpackExportRepository.findById(exportId)

    if (!exportRequest) {
      throw new Error('Export request not found')
    }

    try {
      const modpack = await this.modpackRepository.findById(
        exportRequest.modpackId,
      )

      if (!modpack) {
        throw new Error('Modpack not found')
      }

      const exportConfig =
        await this.modpackExportConfigurationRepository.findByModpackAndUser(
          exportRequest.modpackId,
          exportRequest.userId,
        )

      const modpackMods = await this.modpackModRepository.findByModpack(
        exportRequest.modpackId,
      )

      const modsOrder = exportConfig?.modsOrder || modpack.metadata?.modsOrder

      // Sort modpackMods based on metadata.modsOrder
      if (modsOrder) {
        const orderMap = new Map(modsOrder.map((id, index) => [id, index]))
        modpackMods.sort((a, b) => {
          const indexA = orderMap.get(a.modId) ?? Infinity
          const indexB = orderMap.get(b.modId) ?? Infinity
          return indexA - indexB
        })
      }

      const mods: string[] = []
      const maps: string[] = []
      const workshopItems: string[] = []

      for (const item of modpackMods) {
        if (!item.mod) continue

        const modId = item.mod.id
        const config =
          exportConfig?.modConfig?.[modId] ||
          modpack.metadata?.modConfig?.[modId]

        let steamModIds = item.mod.steamModId || []

        // Filter steamModIds if config exists
        if (config?.selectedSteamModIds) {
          steamModIds = steamModIds.filter((id) =>
            config.selectedSteamModIds.includes(id),
          )
        }

        // If original had steamModIds but now empty (all deselected), skip this mod entirely
        if (
          item.mod.steamModId &&
          item.mod.steamModId.length > 0 &&
          steamModIds.length === 0
        ) {
          continue
        }

        // Workshop Items
        if (item.mod.workshopId) {
          workshopItems.push(item.mod.workshopId)
        }

        // Maps
        if (item.mod.mapFolders && item.mod.mapFolders.length > 0) {
          maps.push(...item.mod.mapFolders)
        }

        // Mods
        if (steamModIds.length > 0) {
          if (exportRequest.version === '42x') {
            // v42 format: \ModID
            mods.push(...steamModIds.map((id) => `\\${id}`))
          } else {
            // v41 format: ModID
            mods.push(...steamModIds)
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
