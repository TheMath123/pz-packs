import type { InferSelectModel } from 'drizzle-orm'
import { boolean, pgTable, text } from 'drizzle-orm/pg-core'
import { createdAt, id, updatedAt } from '../utils/schemas-types'

export const users = pgTable('users', {
  id,
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
  emailVerified: boolean('email_verified').default(false).notNull(),
  image: text('image'),
  role: text('role', { enum: ['user', 'admin'] })
    .default('user')
    .notNull(),
  createdAt,
  updatedAt,
})

export type DUser = InferSelectModel<typeof users>
