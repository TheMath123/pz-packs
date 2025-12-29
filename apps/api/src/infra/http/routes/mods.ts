import { makeGetModByWorkshopIdController } from '@/domain/mod/factories/make-get-mod-by-workshop-id-controller'
import { makeGetModController } from '@/domain/mod/factories/make-get-mod-controller'
import { makeListModsController } from '@/domain/mod/factories/make-list-mods-controller'
import { makeListTagsController } from '@/domain/mod/factories/make-list-tags-controller'
import { makeUpdateAllModsController } from '@/domain/mod/factories/make-update-all-mods-controller'
import { makeUpdateModController } from '@/domain/mod/factories/make-update-mod-controller'
import { listModsQuerySchema } from '@/domain/mod/validation/list-mods.schema'
import {
  modIdParamSchema,
  modWorkshopIdParamSchema,
} from '@/domain/mod/validation/params.schema'
import { updateModBodySchema } from '@/domain/mod/validation/update-mod.schema'
import type { Server } from '../server'

export function modsRoutes(app: Server) {
  app.group('/mods', (route) => {
    // List all tags (no auth required)
    route.get(
      '/tags',
      async ({ status }) => {
        const controller = makeListTagsController()
        const res = await controller.handle()
        return status(res.status, res.value)
      },
      {
        detail: {
          tags: ['Mods'],
          description: 'List all available tags',
          summary: 'List Tags',
        },
      },
    )

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

    // Update all mods
    route.post(
      '/update-all',
      async ({ status, user }) => {
        const controller = makeUpdateAllModsController()
        const res = await controller.handle({ user })
        return status(res.status, res.value)
      },
      {
        auth: true,
        permission: { resource: 'mod', action: 'update-all' },
        detail: {
          tags: ['Mods'],
          description: 'Trigger update of all mods',
          summary: 'Update All Mods',
        },
      },
    )

    // Update mod
    route.patch(
      '/:id',
      async ({ status, params, body }) => {
        const controller = makeUpdateModController()
        const res = await controller.handle({ params, body })
        return status(res.status, res.value)
      },
      {
        auth: true,
        permission: { resource: 'mod', action: 'update' },
        params: modIdParamSchema,
        body: updateModBodySchema,
        detail: {
          tags: ['Mods'],
          description: 'Update mod details',
          summary: 'Update Mod',
        },
      },
    )

    return route
  })

  return app
}
