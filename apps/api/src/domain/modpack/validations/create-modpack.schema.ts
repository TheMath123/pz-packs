import { z } from '@org/validation/zod'

export const createModpackSchema = z.object({
  name: z.string().min(3).max(50),
  description: z.string().max(500).optional(),
  avatarUrl: z.url().optional(),
  isPublic: z.boolean().optional().default(false),
  steamWorkshopUrl: z
    .url({
      hostname: /^steamcommunity\.com$/,
    })
    .optional(),
})

export type CreateModpackSchema = z.infer<typeof createModpackSchema>
