import { z } from '@org/validation/zod'
import { createFileRoute } from '@tanstack/react-router'
import { MyModpacksPage } from './my-modpacks-page'

const modpacksSearchSchema = z.object({
  page: z.coerce.number().int().positive().catch(1),
  limit: z.coerce.number().int().positive().max(100).catch(12),
  search: z.string().optional().catch(undefined),
  sortBy: z.enum(['createdAt', 'updatedAt', 'name']).catch('createdAt'),
  sortOrder: z.enum(['asc', 'desc']).catch('desc'),
})

export const Route = createFileRoute('/modpacks/')({
  validateSearch: modpacksSearchSchema,
  component: MyModpacksPage,
})
