import { database } from '@org/database'
import { betterAuth } from 'better-auth'
import { drizzleAdapter } from 'better-auth/adapters/drizzle'
import { inferAdditionalFields } from 'better-auth/client/plugins'
import { admin as adminPlugin, openAPI } from 'better-auth/plugins'
import { resilientCache } from './cache'
import { env } from './env'
import { ac, admin, user } from './permissions'

export const auth = betterAuth({
  basePath: '/auth',
  plugins: [
    openAPI(),
    adminPlugin({
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
  database: drizzleAdapter(database, { provider: 'pg', usePlural: true }),
  trustedOrigins: env.ORIGIN_ALLOWED,
  advanced: { database: { generateId: false } },
  secondaryStorage: resilientCache,
  session: { cookieCache: { enabled: true, maxAge: 60 * 5 } },
  emailAndPassword: {
    enabled: false,
  },
  socialProviders: {
    discord: {
      clientId: env.DISCORD_CLIENT_ID,
      clientSecret: env.DISCORD_CLIENT_SECRET,
    },
  },
})
