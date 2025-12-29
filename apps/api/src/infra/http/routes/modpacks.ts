import { t } from 'elysia'
import { addModInModpackSchema } from '@/domain/mod/validation/add-mod-in-modpack.schema'
import { modpackController } from '@/domain/modpack/controler'
import { makeAddModController } from '@/domain/modpack/factories/make-add-mod-controller'
import { makeCreateModpackController } from '@/domain/modpack/factories/make-create-modpack-controller'
import { makeGetImportModpackStatusController } from '@/domain/modpack/factories/make-get-import-modpack-status-controller'
import { makeGetServerFileController } from '@/domain/modpack/factories/make-get-server-file-controller'
import { makeImportModpackController } from '@/domain/modpack/factories/make-import-modpack-controller'
import { makeListModpacksController } from '@/domain/modpack/factories/make-list-modpacks-controller'
import { makeRequestServerFileController } from '@/domain/modpack/factories/make-request-server-file-controller'
import {
  addMemberSchema,
  createModpackSchema,
  importModpackSchema,
  listModpacksQuerySchema,
  listModsQuerySchema,
  modpackIdParamSchema,
  removeMemberSchema,
  removeModpackIdParamSchema,
  updateModpackSchema,
} from '@/domain/modpack/validations'
import type { Server } from '../server'

export function modpacksRoutes(app: Server) {
  app.group('/modpacks', (route) => {
    // List public modpacks (no auth required)
    route.get(
      '/public',
      async ({ status, query }) => {
        const controller = makeListModpacksController()
        const res = await controller.handle({ query })
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

    // Get public modpack by ID (no auth required)
    route.get(
      '/public/:id',
      async ({ status, params }) => {
        const res = await modpackController.getPublicById({ params })
        return status(res.status, res.value)
      },
      {
        params: modpackIdParamSchema,
        detail: {
          tags: ['Modpacks'],
          description: 'Get public modpack details by ID',
          summary: 'Get Public Modpack By ID',
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
        permission: { resource: 'modpack', action: 'read' },
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
        const controller = makeCreateModpackController()
        const res = await controller.handle({ body, user })
        return status(res.status, res.value)
      },
      {
        auth: true,
        permission: { resource: 'modpack', action: 'create' },
        body: createModpackSchema,
        detail: {
          tags: ['Modpacks'],
          description: 'Create a new modpack',
          summary: 'Create Modpack',
        },
      },
    )

    // Update modpack
    route.patch(
      '/:id',
      async ({ status, params, body, user }) => {
        const res = await modpackController.update({ params, body, user })
        return status(res.status, res.value)
      },
      {
        auth: true,
        permission: { resource: 'modpack', action: 'update' },
        params: modpackIdParamSchema,
        body: updateModpackSchema,
        detail: {
          tags: ['Modpacks'],
          description: 'Update modpack details (owner only)',
          summary: 'Update Modpack',
        },
      },
    )

    // Request Server File Generation
    route.post(
      '/:id/server-file',
      async ({ status, params, body, user }) => {
        const controller = makeRequestServerFileController()
        const res = await controller.handle({ params, body, user })
        return status(res.status, res.value)
      },
      {
        auth: true,
        permission: { resource: 'modpack', action: 'export' },
        params: modpackIdParamSchema,
        body: t.Object({
          version: t.Union([t.Literal('41x'), t.Literal('42x')]),
        }),
        detail: {
          tags: ['Modpacks'],
          description: 'Request generation of server configuration file',
          summary: 'Request Server File',
        },
      },
    )

    // Download Server File
    route.get(
      '/export/:exportId/download',
      async ({ status, params, set }) => {
        const controller = makeGetServerFileController()
        const res = await controller.handle({ params })

        if (res.status === 200 && res.value.filename) {
          set.headers['Content-Disposition'] =
            `attachment; filename="${res.value.filename}"`
          set.headers['Content-Type'] = 'text/plain'
          return res.value.content
        }

        return status(res.status, res.value)
      },
      {
        auth: true,
        permission: { resource: 'modpack', action: 'export' },
        params: t.Object({
          exportId: t.String(),
        }),
        detail: {
          tags: ['Modpacks'],
          description: 'Download generated server configuration file',
          summary: 'Download Server File',
        },
      },
    )

    // Archive modpack
    route.delete(
      '/:id',
      async ({ status, params, user }) => {
        const res = await modpackController.archive({ params, user })
        return status(res.status, res.value)
      },
      {
        auth: true,
        permission: { resource: 'modpack', action: 'archive' },
        params: modpackIdParamSchema,
        detail: {
          tags: ['Modpacks'],
          description: 'Archive a modpack (soft delete, owner only)',
          summary: 'Archive Modpack',
        },
      },
    )

    // Get modpack by ID
    route.get(
      '/:id',
      async ({ status, params, user }) => {
        const res = await modpackController.getById({ params, user })
        return status(res.status, res.value)
      },
      {
        auth: true,
        params: modpackIdParamSchema,
        detail: {
          tags: ['Modpacks'],
          description: 'Get modpack details by ID (owner, members or public)',
          summary: 'Get Modpack By ID',
        },
      },
    )

    // List members
    route.get(
      '/:id/members',
      async ({ status, params }) => {
        const res = await modpackController.listMembers({ params })
        return status(res.status, res.value)
      },
      {
        params: modpackIdParamSchema,
        detail: {
          tags: ['Members of Modpacks'],
          description: 'List all members of a modpack (public or owner/member)',
          summary: 'List Modpack Members',
        },
      },
    )

    // Add member
    route.post(
      '/:id/members',
      async ({ status, params, body, user }) => {
        const res = await modpackController.addMember({ params, body, user })
        return status(res.status, res.value)
      },
      {
        auth: true,
        permission: { resource: 'modpack', action: 'manager-members' },
        params: modpackIdParamSchema,
        body: addMemberSchema,
        detail: {
          tags: ['Members of Modpacks'],
          description: 'Add a member to the modpack (owner only)',
          summary: 'Add Modpack Member',
        },
      },
    )

    // Remove member
    route.delete(
      '/:id/members',
      async ({ status, params, body, user }) => {
        const res = await modpackController.removeMember({
          params,
          body,
          user,
        })
        return status(res.status, res.value)
      },
      {
        auth: true,
        permission: { resource: 'modpack', action: 'manager-members' },
        params: modpackIdParamSchema,
        body: removeMemberSchema,
        detail: {
          tags: ['Members of Modpacks'],
          description: 'Remove a member from the modpack by email (owner only)',
          summary: 'Remove Modpack Member',
        },
      },
    )

    // Add mod
    route.post(
      '/:id/mods',
      async ({ status, params, body, user }) => {
        const controller = makeAddModController()
        const res = await controller.handle({ params, body, user })
        return status(res.status, res.value)
      },
      {
        auth: true,
        permission: { resource: 'modpack', action: 'add-mod' },
        params: modpackIdParamSchema,
        body: addModInModpackSchema,
        detail: {
          tags: ['Mods'],
          description: 'Add a mod to the modpack (owner/member only)',
          summary: 'Add Mod',
        },
      },
    )

    // Get import status
    route.get(
      '/:id/import/status',
      async ({ status, params }) => {
        const controller = makeGetImportModpackStatusController()
        const res = await controller.handle({ params })
        return status(res.status, res.value)
      },
      {
        auth: true,
        permission: { resource: 'modpack', action: 'import' },
        params: modpackIdParamSchema,
        detail: {
          tags: ['Modpacks'],
          description: 'Get the status of the modpack import job',
          summary: 'Get Import Status',
        },
      },
    )

    // List mods
    route.get(
      '/:id/mods',
      async ({ status, params, query }) => {
        const res = await modpackController.listMods({
          query: { ...query, modpackId: params.id },
        })
        return status(res.status, res.value)
      },
      {
        params: modpackIdParamSchema,
        query: listModsQuerySchema,
        detail: {
          tags: ['Mods'],
          description: 'List mods in a modpack',
          summary: 'List Mods',
        },
      },
    )

    // Remove mod
    route.delete(
      '/:id/mods/:modId',
      async ({ status, params, user }) => {
        const res = await modpackController.removeMod({ params, user })
        return status(res.status, res.value)
      },
      {
        auth: true,
        permission: { resource: 'modpack', action: 'remove-mod' },
        params: removeModpackIdParamSchema,
        detail: {
          tags: ['Mods'],
          description: 'Remove a mod from the modpack (owner/member only)',
          summary: 'Remove Mod',
        },
      },
    )

    // Import modpack from Steam
    route.post(
      '/:id/import',
      async ({ status, params, body, user }) => {
        const controller = makeImportModpackController()
        const res = await controller.handle({ params, body, user })
        return status(res.status, res.value)
      },
      {
        auth: true,
        permission: { resource: 'modpack', action: 'import' },
        params: modpackIdParamSchema,
        body: importModpackSchema,
        detail: {
          tags: ['Modpacks'],
          description: 'Import mods from a Steam Collection to the modpack',
          summary: 'Import Modpack from Steam',
        },
      },
    )

    return route
  })

  return app
}
