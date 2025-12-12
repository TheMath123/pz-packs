import { schema as authenticationEnv } from '@org/auth/env'
import { schema as cacheEnv } from '@org/cache/env'
import { schema as databaseEnv } from '@org/database/env'
import { z } from '@org/validation/zod'

const schema = z.object({
  ...databaseEnv.shape,
  ...cacheEnv.shape,
  ...authenticationEnv.shape,
  STEAM_API_KEY: z.string().min(1),
})

export const env = schema.parse(process.env)
