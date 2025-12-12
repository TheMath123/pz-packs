import { and, eq } from 'drizzle-orm'
import { database } from '../index'
import type { DModpackMod } from '../schemas'
import { modpacksMods } from '../schemas'

export interface AddModToModpackData {
  modpackId: string
  modId: string
}

export class ModpackModRepository {
  /**
   * Add a mod to a modpack
   */
  async addMod(data: AddModToModpackData): Promise<DModpackMod> {
    const [modpackMod] = await database
      .insert(modpacksMods)
      .values({
        modpackId: data.modpackId,
        modId: data.modId,
        isActive: true,
      })
      .returning()

    return modpackMod
  }

  /**
   * Add multiple mods to a modpack
   */
  async addMods(modpackId: string, modIds: string[]): Promise<DModpackMod[]> {
    const values = modIds.map((modId) => ({
      modpackId,
      modId,
      isActive: true,
    }))

    return database.insert(modpacksMods).values(values).returning()
  }

  /**
   * Remove a mod from a modpack (soft delete)
   */
  async removeMod(modpackId: string, modId: string): Promise<void> {
    await database
      .update(modpacksMods)
      .set({
        isActive: false,
      })
      .where(
        and(
          eq(modpacksMods.modpackId, modpackId),
          eq(modpacksMods.modId, modId),
        ),
      )
  }

  /**
   * Get all mods from a modpack (active only)
   */
  async findByModpack(modpackId: string) {
    return database.query.modpacksMods.findMany({
      where: and(
        eq(modpacksMods.modpackId, modpackId),
        eq(modpacksMods.isActive, true),
      ),
      with: {
        mod: true,
      },
    })
  }

  /**
   * Get all modpacks that contain a specific mod (active only)
   */
  async findByMod(modId: string): Promise<DModpackMod[]> {
    return database.query.modpacksMods.findMany({
      where: and(
        eq(modpacksMods.modId, modId),
        eq(modpacksMods.isActive, true),
      ),
      with: {
        modpack: true,
      },
    })
  }

  /**
   * Check if a mod exists in a modpack (active only)
   */
  async exists(modpackId: string, modId: string): Promise<boolean> {
    const modpackMod = await database.query.modpacksMods.findFirst({
      where: and(
        eq(modpacksMods.modpackId, modpackId),
        eq(modpacksMods.modId, modId),
        eq(modpacksMods.isActive, true),
      ),
    })
    return !!modpackMod
  }

  /**
   * Remove all mods from a modpack (soft delete)
   */
  async removeAllMods(modpackId: string): Promise<void> {
    await database
      .update(modpacksMods)
      .set({
        isActive: false,
      })
      .where(eq(modpacksMods.modpackId, modpackId))
  }
}

export const modpackModRepository = new ModpackModRepository()
