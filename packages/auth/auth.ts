import { database } from '@org/database'
import { betterAuth } from 'better-auth'
import { drizzleAdapter } from 'better-auth/adapters/drizzle'
import { openAPI } from 'better-auth/plugins'
import { resilientCache } from './cache'
import { env } from './env'

export const auth = betterAuth({
  basePath: '/auth',
  plugins: [openAPI()],
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
