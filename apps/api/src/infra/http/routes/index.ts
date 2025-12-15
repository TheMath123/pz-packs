import { server } from '@/infra/http/server'
import { openApiPlugin } from '../plugins'
import { modpacksRoutes } from './modpacks'
import { modsRoutes } from './mods'
import { notificationRoutes } from './notifications'

export function initRoutes() {
  server
    .use(openApiPlugin)
    .use(modpacksRoutes)
    .use(modsRoutes)
    .use(notificationRoutes)
  return server
}
