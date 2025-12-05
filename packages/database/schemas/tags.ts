import { pgTable, text } from 'drizzle-orm/pg-core'
import { createdAt, id, updatedAt } from '../utils/schemas-types'

export const tags = pgTable('tags', {
  id,
  name: text('name').notNull(),
  description: text('description'),
  createdAt,
  updatedAt,
})
