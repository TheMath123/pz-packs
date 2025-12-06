import { type InferSelectModel, relations } from 'drizzle-orm'
import { boolean, pgTable, text, uuid } from 'drizzle-orm/pg-core'
import { createdAt, id, updatedAt } from '../utils/schemas-types'
import { users } from './users'

export const modpacks = pgTable('modpacks', {
  id,
  name: text('name').notNull(),
  description: text('description'),
  mods: text('mods').array(),
  avatarUrl: text('avatar_url'),
  steamUrl: text('steam_url'),
  owner: uuid('owner')
    .notNull()
    .references(() => users.id),
  isPublic: boolean('is_public').default(false).notNull(),
  isActive: boolean('is_active').default(true).notNull(),
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

export const modpacksRelations = relations(modpacks, ({ many }) => ({
  members: many(modpacksMembers),
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
