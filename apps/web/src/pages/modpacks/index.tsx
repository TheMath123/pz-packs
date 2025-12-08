import { z } from '@org/validation/zod'
import { createFileRoute } from '@tanstack/react-router'
import { PublicModpacks } from '../components/public-modpacks'

const modpacksSearchSchema = z.object({
  page: z.coerce.number().int().positive().catch(1),
  limit: z.coerce.number().int().positive().max(100).catch(12),
  search: z.string().optional().catch(undefined),
  sortBy: z.enum(['createdAt', 'updatedAt', 'name']).catch('createdAt'),
  sortOrder: z.enum(['asc', 'desc']).catch('desc'),
})

export const Route = createFileRoute('/modpacks/')({
  validateSearch: modpacksSearchSchema,
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div className="container mx-auto py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">My Modpacks</h1>
        <p className="text-muted-foreground">
          Discover and explore community modpacks
        </p>
      </div>
      <PublicModpacks />
    </div>
  )
}
