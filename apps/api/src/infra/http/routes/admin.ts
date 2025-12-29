import { Elysia } from 'elysia'
import { betterAuthPlugin } from '../plugins/better-auth'

export const adminRoutes = new Elysia({ prefix: '/admin' })
  .use(betterAuthPlugin)
  .get(
    '/stats',
    () => {
      return {
        message: 'Admin stats',
      }
    },
    {
      permission: { resource: 'admin', action: 'access' },
    },
  )
