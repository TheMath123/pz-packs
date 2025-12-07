import { createFileRoute } from '@tanstack/react-router'
import { HomePage } from './home-page'

export const Route = createFileRoute('/')({
  component: RouteComponent,
  head: async () => ({
    meta: [
      { title: 'Monorepo Template - Modern Full-Stack Starter' },
      {
        name: 'description',
        content:
          'A production-ready monorepo template with Elysia, Tanstack Router, and modern tooling',
      },
    ],
  }),
})

function RouteComponent() {
  return <HomePage />
}
