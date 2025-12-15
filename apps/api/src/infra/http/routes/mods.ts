import { makeGetModByWorkshopIdController } from '@/domain/mod/factories/make-get-mod-by-workshop-id-controller'
import { makeGetModController } from '@/domain/mod/factories/make-get-mod-controller'
import { makeListModsController } from '@/domain/mod/factories/make-list-mods-controller'
import { listModsQuerySchema } from '@/domain/mod/validation/list-mods.schema'
import {
  modIdParamSchema,
  modWorkshopIdParamSchema,
} from '@/domain/mod/validation/params.schema'
import type { Server } from '../server'

export function modsRoutes(app: Server) {
  app.group('/mods', (route) => {
    // List all mods (no auth required)
    route.get(
      '/',
      async ({ status, query }) => {
        const controller = makeListModsController()
        const res = await controller.handle({ query })
        return status(res.status, res.value)
      },
      {
        query: listModsQuerySchema,
        detail: {
          tags: ['Mods'],
          description: 'List all mods with pagination and filters',
          summary: 'List Mods',
        },
      },
    )

    // Get mod by Workshop ID (no auth required)
    route.get(
      '/workshop/:workshopId',
      async ({ status, params }) => {
        const controller = makeGetModByWorkshopIdController()
        const res = await controller.handle({ params })
        return status(res.status, res.value)
      },
      {
        params: modWorkshopIdParamSchema,
        detail: {
          tags: ['Mods'],
          description: 'Get mod details by Workshop ID',
          summary: 'Get Mod By Workshop ID',
        },
      },
    )

    // Get mod by ID (no auth required)
    route.get(
      '/:id',
      async ({ status, params }) => {
        const controller = makeGetModController()
        const res = await controller.handle({ params })
        return status(res.status, res.value)
      },
      {
        params: modIdParamSchema,
        detail: {
          tags: ['Mods'],
          description: 'Get mod details by ID',
          summary: 'Get Mod By ID',
        },
      },
    )

    return route
  })

  return app
}
