import { z } from '../../zod'

export const updateModFormSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().optional(),
  avatarUrl: z.url('Invalid URL').optional().or(z.literal('')),
  steamUrl: z.url('Invalid URL').optional().or(z.literal('')),
})

export type UpdateModFormData = z.infer<typeof updateModFormSchema>
