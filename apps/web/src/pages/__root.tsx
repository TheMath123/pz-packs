import { Toaster } from '@org/design-system/components/ui/sonner'
import { createRootRoute, HeadContent, Outlet } from '@tanstack/react-router'
import * as React from 'react'
import { AppHeader } from '@/components/header'
import { ReactQueryProvider } from '@/lib/react-query'

export const Route = createRootRoute({
  component: RootComponent,
})

function RootComponent() {
  return (
    <React.Fragment>
      <HeadContent />
      <ReactQueryProvider>
        <Toaster position="top-center" />
        <AppHeader />
        <Outlet />
      </ReactQueryProvider>
    </React.Fragment>
  )
}
