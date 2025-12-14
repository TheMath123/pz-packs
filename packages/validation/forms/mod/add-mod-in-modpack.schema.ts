import z from 'zod'

export const addModInModpackSchema = z.object({
  modAtribute: z
    .string()
    .min(8, { error: 'Mod attribute is required' })
    .or(z.url({ error: 'Mod attribute must be a valid URL' })),
})

export type AddModInModpackFormData = z.infer<typeof addModInModpackSchema>
