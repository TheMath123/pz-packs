import z from 'zod'

export const createModpackFormSchema = z.object({
  name: z
    .string({ error: 'Name is required' })
    .min(3, { error: 'Name must be at least 3 characters long' })
    .max(50, { error: 'Name must be at most 50 characters long' }),
  description: z
    .string({ error: 'Description must be a string' })
    .max(1024, { error: 'Description must be at most 1024 characters long' })
    .optional(),
  avatarUrl: z
    .url({ error: 'Invalid URL format for avatar' })
    .optional()
    .or(z.literal('')),
  steamUrl: z
    .url({
      hostname: /steam(community|usercontent)\.com$/,
      error: 'Invalid Steam Workshop URL format',
    })
    .optional()
    .or(z.literal('')),
})

export type CreateModpackFormData = z.infer<typeof createModpackFormSchema>
