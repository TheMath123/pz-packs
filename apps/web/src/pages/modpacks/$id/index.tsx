import { z } from '@org/validation/zod'
import { createFileRoute } from '@tanstack/react-router'
import { MyModpacksPages } from './-components/my-modpacks-page'

const modsSearchSchema = z.object({
  page: z.coerce.number().int().positive().catch(1).default(1),
  limit: z.coerce.number().int().positive().max(100).catch(12).default(12),
  search: z.string().optional().catch(undefined),
  sortBy: z
    .enum(['createdAt', 'updatedAt', 'name'])
    .catch('createdAt')
    .default('updatedAt'),
  sortOrder: z.enum(['asc', 'desc']).catch('asc').default('desc'),
})

export type ModsFiltersSchema = z.infer<typeof modsSearchSchema>

export const Route = createFileRoute('/modpacks/$id/')({
  validateSearch: modsSearchSchema,
  component: MyModpacksPages,
})
