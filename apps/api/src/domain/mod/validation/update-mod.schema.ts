import { z } from '@org/validation'

export const updateModBodySchema = z
  .object({
    name: z.string(),
    description: z.string(),
    steamUrl: z.string(),
    avatarUrl: z.string(),
    mapFolders: z.array(z.string()),
    requiredMods: z.array(z.string()),
    tags: z.array(z.string()),
    steamModId: z.array(z.string()),
    workshopId: z.string(),
  })
  .partial()

export type UpdateModBodySchema = z.infer<typeof updateModBodySchema>
