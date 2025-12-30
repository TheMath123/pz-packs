import { and, eq } from 'drizzle-orm'
import { database } from '../index'
import {
  type DModpackExportConfiguration,
  modpackExportConfigurations,
} from '../schemas'

export interface SaveExportConfigurationData {
  modpackId: string
  userId: string
  modsOrder?: string[]
  modConfig?: Record<string, { selectedSteamModIds: string[] }>
}

export class ModpackExportConfigurationRepository {
  async findByModpackAndUser(
    modpackId: string,
    userId: string,
  ): Promise<DModpackExportConfiguration | undefined> {
    const [config] = await database
      .select()
      .from(modpackExportConfigurations)
      .where(
        and(
          eq(modpackExportConfigurations.modpackId, modpackId),
          eq(modpackExportConfigurations.userId, userId),
        ),
      )
    return config
  }

  async save(
    data: SaveExportConfigurationData,
  ): Promise<DModpackExportConfiguration> {
    const existing = await this.findByModpackAndUser(
      data.modpackId,
      data.userId,
    )

    if (existing) {
      const [updated] = await database
        .update(modpackExportConfigurations)
        .set({
          modsOrder: data.modsOrder,
          modConfig: data.modConfig,
          updatedAt: new Date(),
        })
        .where(eq(modpackExportConfigurations.id, existing.id))
        .returning()
      return updated
    }

    const [created] = await database
      .insert(modpackExportConfigurations)
      .values({
        modpackId: data.modpackId,
        userId: data.userId,
        modsOrder: data.modsOrder,
        modConfig: data.modConfig,
      })
      .returning()
    return created
  }
}
