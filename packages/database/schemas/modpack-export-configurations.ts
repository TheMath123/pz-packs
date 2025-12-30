import { type InferSelectModel } from 'drizzle-orm'
import { jsonb, pgTable, uuid } from 'drizzle-orm/pg-core'
import { createdAt, id, updatedAt } from '../utils/schemas-types'
import { modpacks } from './modpacks'
import { users } from './users'

export const modpackExportConfigurations = pgTable(
  'modpack_export_configurations',
  {
    id,
    modpackId: uuid('modpack_id')
      .notNull()
      .references(() => modpacks.id),
    userId: uuid('user_id')
      .notNull()
      .references(() => users.id),
    modsOrder: jsonb('mods_order').$type<string[]>(),
    modConfig: jsonb('mod_config').$type<
      Record<
        string,
        {
          selectedSteamModIds: string[]
        }
      >
    >(),
    createdAt,
    updatedAt,
  },
)

export type DModpackExportConfiguration = InferSelectModel<
  typeof modpackExportConfigurations
>
