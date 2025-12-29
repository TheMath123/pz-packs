import { Card, CardTitle } from '@org/design-system/components/ui/card'
import { useTheme } from '@org/design-system/providers'
import { Link } from '@tanstack/react-router'
import { UpdateModDialog } from '@/pages/mods/-components/update-mod-dialog'
import type { IModDTO } from '@/services/mod/dtos'
import { ModDetail } from './mod-detail'
import { ModIdsDisplay } from './mod-ids-display'
import { ModMapFolderDisplay } from './mod-map-folder-display'
import { ModRequiredModsDisplay } from './mod-required-mods-display'
import { RemoveModDialog } from './remove-mod-dialog'

interface ModCardProps {
  data: IModDTO
  canManage: boolean
  modpackId?: string
}

export function ModCard({ data, modpackId, canManage }: ModCardProps) {
  const { theme } = useTheme()

  if (!data) return null

  return (
    <Card className="flex flex-row items-start p-0 overflow-hidden gap-0">
      <div className="relative bg-primary/30 dark:bg-primary aspect-square h-full flex items-center justify-center text-muted-foreground/20 overflow-clip">
        {data.avatarUrl ? (
          <img
            src={data.avatarUrl}
            alt={data.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <img
            src={
              theme === 'light'
                ? '/brand/zumbi-danced.svg'
                : '/brand/zumbi-danced-dark.svg'
            }
            alt={data.name}
            className="h-8 opacity-80"
          />
        )}
      </div>
      <div className="flex flex-col items-start justify-between gap-2 p-2 h-full w-full">
        <div className="flex flex-col gap-2 items-start relative w-full">
          <div className="flex flex-row gap-1 items-center justify-between w-full">
            <Link
              to={data.steamUrl || '#'}
              target="_blank"
              rel="noopener noreferrer"
            >
              <CardTitle className="hover:underline cursor-pointer break-all max-w-50">
                {data.name}
              </CardTitle>
            </Link>
            <div className="flex items-center gap-1">
              {canManage && !modpackId && <UpdateModDialog mod={data} />}
              {canManage && modpackId && (
                <RemoveModDialog
                  modpackId={modpackId}
                  modId={data.id}
                  modName={data.name}
                />
              )}
            </div>
          </div>
          <h2 className="hidden md:flex text-muted-foreground font-light text-xs flex-row items-center gap-1">
            Workshop ID:
            <strong className="font-medium select-all">
              {data.workshopId}
            </strong>
          </h2>
          <ModRequiredModsDisplay data={data} />
        </div>

        <div className="flex flex-row justify-between items-end w-full gap-2 flex-wrap">
          <div className="flex flex-col items-start">
            <ModMapFolderDisplay data={data} />
            <ModIdsDisplay data={data} />
          </div>
          <ModDetail data={data} />
        </div>
      </div>
    </Card>
  )
}
