import { z } from '@org/validation'

export const importModpackSchema = z.object({
  steamUrl: z.url({
    hostname: /^steamcommunity\.com$/,
    error: 'Invalid Steam Workshop URL format',
  }),
})

export type ImportModpackFormData = z.infer<typeof importModpackSchema>
