import { auth, type Permission } from '@org/auth'
import { Elysia } from 'elysia'

export const betterAuthPlugin = new Elysia({ name: 'better-auth' })
  .mount(auth.handler)
  .macro({
    auth: {
      async resolve({ status, request: { headers } }) {
        const session = await auth.api.getSession({ headers })

        if (!session) return status(401, { message: 'Unauthorized' })
        return session
      },
    },
    permission(permission?: Permission) {
      return {
        async resolve({ status, request: { headers } }) {
          if (!permission) return

          const session = await auth.api.getSession({ headers })

          if (!session) return status(401, { message: 'Unauthorized' })

          const actions = Array.isArray(permission.action)
            ? permission.action
            : [permission.action]

          const { success } = await auth.api.userHasPermission({
            headers,
            body: {
              role: session.user.role as 'user' | 'admin',
              permissions: {
                [permission.resource]: actions,
              },
            },
          })

          if (!success)
            return status(403, { message: 'Do not have permission' })
        },
      }
    },
  })
