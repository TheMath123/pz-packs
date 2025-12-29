import { server } from '@/infra/http/server'
import { openApiPlugin } from '../plugins'
import { adminRoutes } from './admin'
import { modpacksRoutes } from './modpacks'
import { modsRoutes } from './mods'
import { notificationRoutes } from './notifications'

export function initRoutes() {
  server
    .use(openApiPlugin)
    .use(modpacksRoutes)
    .use(modsRoutes)
    .use(notificationRoutes)
    .use(adminRoutes)
  return server
}
