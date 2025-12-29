import { z } from '../../zod'

const splitByNewLine = (val?: string) =>
  val
    ? val
        .split('\n')
        .map((s) => s.trim())
        .filter(Boolean)
    : []

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
  mapFolders: z.string().optional().transform(splitByNewLine),
  requiredMods: z.string().optional().transform(splitByNewLine),
  steamModId: z.string().optional().transform(splitByNewLine),
  workshopId: z.string().optional(),
})

export type UpdateModFormData = z.input<typeof updateModFormSchema>
