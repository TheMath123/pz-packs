import type { ModpackModRepository } from '@org/database/repository/modpack-mod-repository'
import type { UpsertModFromSteamUseCase } from '@/domain/mod/use-cases/upsert-mod-from-steam'

export class AddModToModpackUseCase {
  constructor(
    private modpackModRepository: ModpackModRepository,
    private upsertModFromSteamUseCase: UpsertModFromSteamUseCase,
  ) {}

  async execute(
    workshopId: string,
    modpackId: string,
    processedWorkshopIds: Set<string> = new Set(),
    addedMods: string[] = [],
  ): Promise<void> {
    if (processedWorkshopIds.has(workshopId)) return
    processedWorkshopIds.add(workshopId)

    const mod = await this.upsertModFromSteamUseCase.execute(workshopId)

    if (!mod) return

    // Add to modpack if not exists
    const existingModpackMod = await this.modpackModRepository.findMod(
      modpackId,
      mod.id,
    )

    if (existingModpackMod) {
      if (!existingModpackMod.isActive) {
        await this.modpackModRepository.reactivateMod(modpackId, mod.id)
        addedMods.push(mod.name)
      }
    } else {
      await this.modpackModRepository.addMod({ modpackId, modId: mod.id })
      addedMods.push(mod.name)
    }

    // Process requirements
    if (mod.requiredMods && mod.requiredMods.length > 0) {
      for (const reqWorkshopId of mod.requiredMods) {
        if (reqWorkshopId) {
          await this.execute(
            reqWorkshopId,
            modpackId,
            processedWorkshopIds,
            addedMods,
          )
        }
      }
    }
  }
}
