import { modpackController } from '@/domain/modpack/controler'
import {
  createModpackSchema,
  listModpacksQuerySchema,
} from '@/domain/modpack/validations'
import type { Server } from '../server'

export function modpacksRoutes(app: Server) {
  app.group('/modpacks', (route) => {
    // List public modpacks (no auth required)
    route.get(
      '/public',
      async ({ status, query }) => {
        const res = await modpackController.listPublic({ query })
        return status(res.status, res.value)
      },
      {
        query: listModpacksQuerySchema,
        detail: {
          tags: ['Modpacks'],
          description: 'List all public modpacks with pagination and filters',
          summary: 'List Public Modpacks',
        },
      },
    )

    // List user's modpacks (auth required)
    route.get(
      '/my',
      async ({ status, query, user }) => {
        const res = await modpackController.listMy({ query, user })
        return status(res.status, res.value)
      },
      {
        auth: true,
        query: listModpacksQuerySchema,
        detail: {
          tags: ['Modpacks'],
          description:
            'List modpacks owned by or shared with the authenticated user',
          summary: 'List My Modpacks',
        },
      },
    )

    // Create modpack
    route.post(
      '/',
      async ({ status, body, user }) => {
        const res = await modpackController.create({ body, user })
        return status(res.status, res.value)
      },
      {
        auth: true,
        body: createModpackSchema,
        detail: {
          tags: ['Modpacks'],
          description: 'Create a new modpack',
          summary: 'Create Modpack',
        },
      },
    )

    return route
  })

  return app
}
