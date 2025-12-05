import { boolean, pgTable, text, uuid } from 'drizzle-orm/pg-core'
import { createdAt, id, updatedAt } from '../utils/schemas-types'
import { tags } from './tags'

export const mods = pgTable('mods', {
  id,
  name: text('name').notNull(),
  modId: text('mod_id').notNull(),
  workshopId: text('workshop_id').notNull(),
  mapFolders: text('map_folders').array(),
  isActive: boolean('is_active').default(true).notNull(),
  requiredMods: text('required_mods').array(),
  description: text('description'),
  steamUrl: text('steam_url'),
  avatarUrl: text('avatar_url'),
  highlights: text('highlights').array(),
  tags: uuid('tags')
    .references(() => tags.id)
    .array(),
  createdAt,
  updatedAt,
})
