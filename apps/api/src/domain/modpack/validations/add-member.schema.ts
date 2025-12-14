import { z } from '@org/validation/zod'

export const addMemberSchema = z.object({
  email: z.email({ error: 'Invalid email format' }),
  permission: z
    .array(z.string({ error: 'Invalid permission format' }))
    .min(1, 'At least one permission is required'),
})

export type AddMemberSchema = z.infer<typeof addMemberSchema>
