import { z } from '../../zod'

export const updateModFormSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().optional(),
  avatarUrl: z
    .url({
      hostname: /steam(community|usercontent)\.com$/,
      error: 'Invalid Steam Workshop URL format',
    })
    .optional()
    .or(z.literal('')),
  steamUrl: z
    .url({
      hostname: /steam(community|usercontent)\.com$/,
      error: 'Invalid Steam Workshop URL format',
    })
    .optional()
    .or(z.literal('')),
  mapFolders: z.string().optional(),
  requiredMods: z.string().optional(),
  steamModId: z.string().optional(),
  workshopId: z.string().optional(),
})

export type UpdateModFormData = z.input<typeof updateModFormSchema>
