import { z } from '@org/validation/zod'

export const createModpackSchema = z.object({
  name: z
    .string({ error: 'Name is required' })
    .min(3, { error: 'Name must be at least 3 characters long' })
    .max(50, { error: 'Name must be at most 50 characters long' }),
  description: z
    .string({ error: 'Description must be a string' })
    .max(1024, { error: 'Description must be at most 1024 characters long' })
    .optional(),
  avatarUrl: z.url({ error: 'Invalid URL format for avatar' }).optional(),
  isPublic: z
    .boolean({ error: 'Invalid boolean value for isPublic' })
    .optional()
    .default(false),
  steamWorkshopUrl: z
    .url({
      hostname: /^steamcommunity\.com$/,
      error: 'Invalid Steam Workshop URL format',
    })
    .optional(),
})

export type CreateModpackSchema = z.infer<typeof createModpackSchema>
