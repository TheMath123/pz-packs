import { type InferSelectModel, relations } from 'drizzle-orm'
import {
  boolean,
  jsonb,
  pgTable,
  text,
  unique,
  uuid,
} from 'drizzle-orm/pg-core'
import { createdAt, id, updatedAt } from '../utils/schemas-types'
import { mods } from './mods'
import { users } from './users'

export const modpacks = pgTable('modpacks', {
  id,
  name: text('name').notNull(),
  description: text('description'),
  avatarUrl: text('avatar_url'),
  steamUrl: text('steam_url'),
  owner: uuid('owner')
    .notNull()
    .references(() => users.id),
  isVerified: boolean('is_verified').default(false).notNull(),
  isPublic: boolean('is_public').default(false).notNull(),
  isActive: boolean('is_active').default(true).notNull(),
  metadata: jsonb('metadata').$type<{
    modsOrder: string[] // modIds in order
    modConfig: Record<
      string,
      {
        // modId -> config
        selectedSteamModIds: string[]
      }
    >
  }>(),
  createdAt,
  updatedAt,
})

export type DModpack = InferSelectModel<typeof modpacks>

export const modpacksMembers = pgTable('modpacks_members', {
  id,
  modpackId: uuid('modpack_id')
    .notNull()
    .references(() => modpacks.id),
  userId: uuid('user_id')
    .notNull()
    .references(() => users.id),
  isActive: boolean('is_active').default(true).notNull(),
  permission: text('permission').array().notNull(),
  createdAt,
  updatedAt,
})

export type DModpackMember = InferSelectModel<typeof modpacksMembers>

export const modpacksMods = pgTable(
  'modpacks_mods',
  {
    id,
    modpackId: uuid('modpack_id')
      .notNull()
      .references(() => modpacks.id),
    modId: uuid('mod_id')
      .notNull()
      .references(() => mods.id),
    isActive: boolean('is_active').default(true).notNull(),
    createdAt,
    updatedAt,
  },
  (t) => ({
    unq: unique().on(t.modpackId, t.modId),
  }),
)

export type DModpackMod = InferSelectModel<typeof modpacksMods>

export const modpacksRelations = relations(modpacks, ({ many }) => ({
  members: many(modpacksMembers),
  mods: many(modpacksMods),
}))

export const modpacksMembersRelations = relations(
  modpacksMembers,
  ({ one }) => ({
    modpack: one(modpacks, {
      fields: [modpacksMembers.modpackId],
      references: [modpacks.id],
    }),
  }),
)

export const modpacksModsRelations = relations(modpacksMods, ({ one }) => ({
  modpack: one(modpacks, {
    fields: [modpacksMods.modpackId],
    references: [modpacks.id],
  }),
  mod: one(mods, {
    fields: [modpacksMods.modId],
    references: [mods.id],
  }),
}))

export const modpackExports = pgTable('modpack_exports', {
  id,
  modpackId: uuid('modpack_id')
    .notNull()
    .references(() => modpacks.id),
  userId: uuid('user_id').references(() => users.id),
  version: text('version').notNull(),
  status: text('status', { enum: ['pending', 'completed', 'failed'] })
    .default('pending')
    .notNull(),
  fileContent: text('file_content'),
  createdAt,
  updatedAt,
})

export type DModpackExport = InferSelectModel<typeof modpackExports>
