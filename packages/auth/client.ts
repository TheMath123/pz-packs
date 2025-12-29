import { adminClient, inferAdditionalFields } from 'better-auth/client/plugins'
import { createAuthClient } from 'better-auth/react'
import { ac, admin, user } from './permissions'

export function generateAuthClient(baseURL: string) {
  return createAuthClient({
    baseURL: baseURL,
    basePath: '/auth',
    plugins: [
      adminClient({
        ac,
        roles: {
          admin,
          user,
        },
      }),
      inferAdditionalFields({
        user: {
          role: {
            type: 'string',
          },
        },
      }),
    ],
  })
}
