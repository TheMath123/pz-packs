import { Button } from '@org/design-system/components/ui/button'
import { ButtonGroup } from '@org/design-system/components/ui/button-group.tsx'
import { SteamLogoIcon } from '@org/design-system/components/ui/icons'
import { Link, useNavigate, useParams } from '@tanstack/react-router'
import { ModpackVisibilityBadge } from '@/components/modpack/index.ts'
import { ModpackVerifiedBadge } from '@/components/modpack/modpack-verified-badge.tsx'
import { useCanManageModpack, useModpack, usePublicModpack } from '@/hooks'
import { authClient } from '@/lib/auth.ts'
import { AddModDialog } from './add-mod/add-mod-dialog'
import { ArchiveModpackDialog } from './archive-mobdpack-dialog.tsx'
import { Members } from './members/members.tsx'
import { ModsList } from './mods/mods-list'
import { UpdateModpackDialog } from './update/update-modpack-dialog.tsx'

export function MyModpacksPages() {
  const { data } = authClient.useSession()
  const { id } = useParams({ strict: false }) as { id: string }
  const navigate = useNavigate()
  const useList = data ? useModpack : usePublicModpack
  const { data: modpack, isLoading, error } = useList(id)
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
    <div className="container mx-auto py-8 flex flex-col gap-6">
      <div>
        <div className="flex flex-row justify-between gap-4 mb-6 flex-wrap">
          <div className="flex flex-col gap-2">
            <div className="flex flex-row gap-2 items-center">
              <h1 className="text-2xl font-bold">{modpack.name}</h1>
              {modpack.isVerified && <ModpackVerifiedBadge />}
              <ModpackVisibilityBadge isPublic={modpack.isPublic} />
            </div>
            {modpack.description && (
              <p className="text-muted-foreground text-sm max-w-2xl">
                {modpack.description}
              </p>
            )}

            <Members modpackId={modpack.id} canManageMembers={canManage} />
          </div>
          <ButtonGroup className="h-11">
            <ButtonGroup>
              {modpack.steamUrl && (
                <Button
                  variant="outline"
                  size="icon"
                  className="w-fit bg-[#1b2838] "
                  aria-label="Visit modpack in steam workshop"
                  render={
                    <Link
                      to={modpack.steamUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-primary hover:underline"
                    >
                      <SteamLogoIcon
                        className="w-6 h-6 text-white"
                        weight="bold"
                      />
                    </Link>
                  }
                />
              )}
            </ButtonGroup>
            {canManage && (
              <ButtonGroup>
                <AddModDialog modpackId={modpack.id} />
                <UpdateModpackDialog modpack={modpack} />
                <ArchiveModpackDialog modpack={modpack} />
              </ButtonGroup>
            )}
          </ButtonGroup>
        </div>
      </div>
      <div>
        <ModsList modpackId={modpack.id} canManage={canManage} />
      </div>
    </div>
  )
}
