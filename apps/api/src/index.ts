import '@/env'
import './infra/queue/modpack-import/worker'
import './infra/queue/notification/worker'
import { initRoutes } from './infra/http/routes'
import { server } from './infra/http/server'

const app = server
  .use(initRoutes)
  .get('/health', () => ({
    message: 'OK',
  }))
  .listen(3001)

console.log(`🦊 Elysia is running at ${app.server?.url}`)
