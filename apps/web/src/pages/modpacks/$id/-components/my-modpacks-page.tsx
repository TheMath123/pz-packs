import { Badge } from '@org/design-system/components/ui/badge'
import { Button } from '@org/design-system/components/ui/button'
import { SteamLogoIcon } from '@org/design-system/components/ui/icons'
import { Link, useNavigate, useParams } from '@tanstack/react-router'
import { useCanManageModpack } from '@/hooks'
import { useModpackDetails } from '@/hooks/modpack'
import { Members } from './members/members.tsx'
import { UpdateModpackDialog } from './update-modpack-dialog.tsx'

export function MyModpacksPages() {
  const { id } = useParams({ strict: false }) as { id: string }
  const navigate = useNavigate()
  const { data: modpack, isLoading, error } = useModpackDetails(id)
  const canManage = useCanManageModpack(modpack?.owner || '')

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
        <div className="flex flex-col gap-2 items-center mx-auto max-w-2xl">
          <h1 className="text-2xl font-bold mb-4">Oh no! A problem occurred</h1>
          <p className="text-destructive mb-4 p-4 border-2 border-destructive/20 rounded">
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
        <div className="flex flex-row justify-between gap-4 mb-6">
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
              {modpack.steamUrl && (
                <Button
                  variant="ghost"
                  size="icon"
                  aria-label="Visit modpack in steam workshop"
                  render={
                    <Link
                      to={modpack.steamUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-primary hover:underline"
                    >
                      <SteamLogoIcon
                        className="w-6 h-6 text-foreground"
                        weight="bold"
                      />
                    </Link>
                  }
                />
              )}
            </div>
            {modpack.description && (
              <p className="text-muted-foreground text-sm max-w-2xl">
                {modpack.description}
              </p>
            )}
            <Members modpackId={modpack.id} canManageMembers={canManage} />
          </div>
          <div className="flex flex-col gap-4 items-end">
            <UpdateModpackDialog modpack={modpack} />
          </div>
        </div>

        <div className="flex items-center gap-4 mb-6">
          <div className="flex items-center space-x-2"></div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6"></div>
    </div>
  )
}
