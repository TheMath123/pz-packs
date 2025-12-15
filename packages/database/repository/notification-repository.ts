import { desc, eq } from 'drizzle-orm'
import { db } from '..'
import { notifications } from '../schemas/notifications'

export const notificationRepository = {
  create: async (data: typeof notifications.$inferInsert) => {
    const [notification] = await db
      .insert(notifications)
      .values(data)
      .returning()
    return notification
  },

  listByUserId: async (userId: string, limit = 20) => {
    return db
      .select()
      .from(notifications)
      .where(eq(notifications.userId, userId))
      .orderBy(desc(notifications.createdAt))
      .limit(limit)
  },

  markAsRead: async (id: string, userId: string) => {
    const [notification] = await db
      .update(notifications)
      .set({ isRead: true })
      .where(eq(notifications.id, id)) // Adicionar verificação de userId se necessário para segurança extra
      .returning()
    return notification
  },

  markAllAsRead: async (userId: string) => {
    return db
      .update(notifications)
      .set({ isRead: true })
      .where(eq(notifications.userId, userId))
  },
}
