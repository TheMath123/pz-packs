import { z } from '@org/validation/zod'

export const modpackIdParamSchema = z.object({
  id: z.uuid({ error: 'Invalid modpack ID format' }),
})

export const removeModpackIdParamSchema = modpackIdParamSchema.extend({
  modId: z.uuid({ error: 'Invalid mod ID format' }),
})

export const memberIdParamSchema = z.object({
  modpackId: z.uuid({ error: 'Invalid modpack ID format' }),
  memberId: z.uuid({ error: 'Invalid member ID format' }),
})

export type RemoveModpackIdParam = z.infer<typeof removeModpackIdParamSchema>
export type ModpackIdParam = z.infer<typeof modpackIdParamSchema>
export type MemberIdParam = z.infer<typeof memberIdParamSchema>
