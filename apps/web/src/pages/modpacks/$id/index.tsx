import { createFileRoute } from '@tanstack/react-router'
import { ModpackDetailsPage } from '../components/modpack-details-page'

export const Route = createFileRoute('/modpacks/$id/')({
  component: ModpackDetailsPage,
})
