import { boolean, pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core'
import { users } from './users'

export const notifications = pgTable('notifications', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: text('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  title: text('title').notNull(),
  content: text('content').notNull(),
  type: text('type', { enum: ['info', 'success', 'warning', 'error'] })
    .default('info')
    .notNull(),
  isRead: boolean('is_read').default(false).notNull(),
  metadata: text('metadata'), // JSON string para links ou dados extras
  createdAt: timestamp('created_at').defaultNow().notNull(),
})
