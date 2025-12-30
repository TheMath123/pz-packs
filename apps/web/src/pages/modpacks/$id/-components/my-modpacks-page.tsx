import { Button } from '@org/design-system/components/ui/button'
import { ButtonGroup } from '@org/design-system/components/ui/button-group.tsx'
import {
  CopyIcon,
  ShareNetworkIcon,
  SteamLogoIcon,
} from '@org/design-system/components/ui/icons'
import { toast } from '@org/design-system/components/ui/sonner.tsx'
import { Link, useNavigate, useParams } from '@tanstack/react-router'
import { format } from 'date-fns'
import { ModpackVisibilityBadge } from '@/components/modpack/index.ts'
import { ModpackVerifiedBadge } from '@/components/modpack/modpack-verified-badge.tsx'
import { useCanManageModpack, useModpack, usePublicModpack } from '@/hooks'
import { authClient } from '@/lib/auth.ts'
import { ArchiveModpackDialog } from './archive-modpack-dialog.tsx'
import { ExportModpackDialog } from './export-modpack/export-modpack-dialog.tsx'
import { Members } from './members/members.tsx'
import { ModsList } from './mods/mods-list'
import { UpdateModpackDialog } from './update/update-modpack-dialog.tsx'

export function MyModpacksPages() {
  const { data } = authClient.useSession()
  const { id } = useParams({ strict: false }) as { id: string }
  const navigate = useNavigate()
  const useList = data ? useModpack : usePublicModpack
  const { data: modpack, isLoading, error } = useList(id)
  const canManage = useCanManageModpack(modpack)

  const handleShare = async () => {
    const shareData = {
      title: modpack?.name ?? 'PZ Packs',
      text: 'Check out this modpack I found on PZ Packs!',
      url: window.location.href.split('?')[0],
    }

    try {
      if (navigator.share) {
        await navigator.share(shareData)
      } else {
        navigator.clipboard.writeText(shareData.url)
        toast.custom(() => (
          <>
            <CopyIcon className="inline-block w-5 h-5 mr-2" weight="bold" />
            Link copied to clipboard!
          </>
        ))
      }
    } catch (_err) {
      // Handle errors silently
    }
  }

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
    <div className="container mx-auto py-8 flex flex-col gap-6 relative mb-10">
      <div className="flex flex-row items-start justify-between gap-4 flex-wrap">
        <div className="flex flex-row gap-4 items-start justify-center flex-wrap ">
          {modpack.avatarUrl && (
            <img
              src={modpack.avatarUrl || ''}
              alt={modpack.name}
              width={200}
              className="h-50 w-auto rounded-md"
            />
          )}
          <div className="flex flex-col gap-2">
            <div className="flex flex-row gap-2 items-center">
              <h1 className="text-2xl font-bold">{modpack.name}</h1>
              {modpack.isVerified && <ModpackVerifiedBadge />}
              <ModpackVisibilityBadge isPublic={modpack.isPublic} />
            </div>

            <div className="flex flex-row gap-2 items-center text-xs text-muted-foreground">
              <span>Created: {format(new Date(modpack.createdAt), 'PPP')}</span>
              <span>•</span>
              <span>
                Last updated: {format(new Date(modpack.updatedAt), 'PPP')}
              </span>
            </div>

            <article className="flex flex-col gap-2 py-2">
              {modpack.description?.split('\n').map((line, index) => (
                <p
                  key={index}
                  className="text-muted-foreground text-sm max-w-2xl"
                >
                  {line}
                </p>
              ))}
            </article>

            <Members modpackId={modpack.id} canManageMembers={canManage} />
          </div>
        </div>
        <ButtonGroup>
          <ButtonGroup>
            {modpack.steamUrl && (
              <Button
                variant="outline"
                size="icon"
                aria-label="Visit modpack in steam workshop"
                title="Visit modpack in steam workshop"
                className="bg-[#1b2838]"
                render={
                  <Link
                    to={modpack.steamUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-primary hover:underline "
                  >
                    <SteamLogoIcon
                      className="w-6 h-6 text-white"
                      weight="bold"
                    />
                  </Link>
                }
              ></Button>
            )}
          </ButtonGroup>
          <ButtonGroup>
            <Button
              variant="outline"
              size="icon"
              aria-label="Share modpack"
              title="Share modpack"
              className="bg-blue-500"
              onClick={handleShare}
            >
              <ShareNetworkIcon className="w-5 h-5 text-white" weight="bold" />
            </Button>
          </ButtonGroup>
        </ButtonGroup>
      </div>
      <div className="relative">
        <div className="flex flex-row gap-2 absolute -top-16 right-0">
          {canManage && modpack && (
            <>
              <UpdateModpackDialog modpack={modpack} />
              <ArchiveModpackDialog modpack={modpack} />
            </>
          )}
        </div>
        <ModsList
          modpack={modpack}
          canManage={canManage ?? false}
          isAuthenticated={!!data}
        />
      </div>
    </div>
  )
}
