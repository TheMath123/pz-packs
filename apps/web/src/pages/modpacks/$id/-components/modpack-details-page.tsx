import { Badge } from '@org/design-system/components/ui/badge'
import { Button } from '@org/design-system/components/ui/button'
import { useNavigate, useParams } from '@tanstack/react-router'
import { useModpackDetails } from '@/hooks/modpack'
import { ModpackMembers } from './members/modpack-members'
import { UpdateModpackForm } from './update-modpack-form'

export function ModpackDetailsPage() {
  const { id } = useParams({ strict: false }) as { id: string }
  const navigate = useNavigate()
  const { data: modpack, isLoading, error } = useModpackDetails(id)

  if (isLoading) {
    return (
      <div className="container mx-auto py-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-muted rounded w-1/3" />
          <div className="h-4 bg-muted rounded w-1/2" />
          <div className="h-64 bg-muted rounded" />
        </div>
      </div>
    )
  }

  if (error || !modpack) {
    return (
      <div className="container mx-auto py-8">
        <div className="text-center mx-auto">
          <p className="text-destructive mb-4">
            {error?.message || 'Modpack not found'}
          </p>
          <Button
            onClick={() =>
              navigate({
                to: '/modpacks',
                search: {
                  page: 1,
                  limit: 12,
                  sortBy: 'createdAt',
                  sortOrder: 'desc',
                },
              })
            }
          >
            Back
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-8">
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div className="flex flex-col gap-2">
            <div className="flex flex-row gap-2 items-center">
              <h1 className="text-2xl font-bold">{modpack.name}</h1>
              {modpack.isPublic ? (
                <Badge variant="solid" size="sm">
                  Public
                </Badge>
              ) : (
                <Badge variant="solid" size="sm">
                  Private
                </Badge>
              )}
            </div>
            {modpack.description && (
              <p className="text-muted-foreground">{modpack.description}</p>
            )}
          </div>
          <div className="flex gap-2">
            <UpdateModpackForm modpackId={id} modpack={modpack} />
          </div>
        </div>

        <div className="flex items-center gap-4 mb-6">
          <div className="flex items-center space-x-2"></div>
          {modpack.steamUrl && (
            <a
              href={modpack.steamUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-primary hover:underline"
            >
              View on Steam Workshop
            </a>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <ModpackMembers modpackId={id} />
      </div>
    </div>
  )
}
