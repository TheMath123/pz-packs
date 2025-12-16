import { Card, CardTitle } from '@org/design-system/components/ui/card'
import { useTheme } from '@org/design-system/providers'
import { Link } from '@tanstack/react-router'
import type { IModDTO } from '@/services/mod/dtos'
import { ModDetail } from './mod-detail'
import { ModIdsDisplay } from './mod-ids-display'
import { ModMapFolderDisplay } from './mod-map-folder-display'
import { ModRequiredModsDisplay } from './mod-required-mods-display'
import { RemoveModDialog } from './remove-mod-dialog'

interface ModCardProps {
  data: IModDTO
  canManage: boolean
  modpackId: string
}

export function ModCard({ data, modpackId, canManage }: ModCardProps) {
  const { theme } = useTheme()

  if (!data || !modpackId) return null

  console.log(data)

  return (
    <Card className="flex flex-row items-start p-0 overflow-hidden gap-0">
      <div className="relative bg-primary/30 dark:bg-primary aspect-square h-32 flex items-center justify-center text-muted-foreground/20 overflow-clip">
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
        <div className="flex flex-col gap-2 items-start">
          <Link
            to={data.steamUrl || '#'}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:underline"
          >
            <CardTitle>{data.name}</CardTitle>
          </Link>
          <h2 className="text-muted-foreground py-1 px-2 bg-muted rounded-md w-fit text-xs">
            {data.workshopId}
          </h2>
          <ModDetail data={data} />
        </div>

        <div className="flex flex-row justify-between items-end w-full gap-2 flex-wrap">
          <div className="flex flex-col items-start">
            <ModMapFolderDisplay data={data} />
            <ModIdsDisplay data={data} />
            <ModRequiredModsDisplay data={data} />
          </div>

          {canManage && (
            <RemoveModDialog
              modpackId={modpackId}
              modId={data.id}
              modName={data.name}
            />
          )}
        </div>
      </div>
    </Card>
  )
}
