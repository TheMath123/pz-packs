import { createFileRoute } from '@tanstack/react-router'
import { MyModpacksPages } from './-components/my-modpacks-page'

export const Route = createFileRoute('/modpacks/$id/')({
  component: MyModpacksPages,
})
