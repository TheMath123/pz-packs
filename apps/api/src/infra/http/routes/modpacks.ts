import { modpackController } from '@/domain/modpack/controler'
import { createModpackSchema } from '@/domain/modpack/validations/create-modpack.schema'
import type { Server } from '../server'

export function modpacksRoutes(app: Server) {
  app.group('/modpacks', (route) => {
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
