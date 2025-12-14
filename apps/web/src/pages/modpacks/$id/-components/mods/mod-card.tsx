import { Card, CardTitle } from '@org/design-system/components/ui/card'
import { useTheme } from '@org/design-system/providers'
import { Link } from '@tanstack/react-router'
import type { IModDTO } from '@/services/mod/dtos'
import { RemoveModDialog } from './remove-mod-dialog'

interface ModCardProps {
  data: IModDTO
  canManage: boolean
  modpackId: string
}

export function ModCard({ data, modpackId, canManage }: ModCardProps) {
  const { theme } = useTheme()

  if (!data || !modpackId) return null

  return (
    <Card className="flex flex-row items-center justify-between p-4 gap-4">
      <div className="flex flex-row items-center gap-4">
        <div className="relative bg-primary/30 dark:bg-primary aspect-square h-12 w-12 flex items-center justify-center rounded-lg text-muted-foreground/20 overflow-clip">
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
        <div className="flex flex-col">
          <CardTitle className="text-base hover:underline">
            <Link
              to={data.steamUrl || '#'}
              target="_blank"
              rel="noopener noreferrer"
            >
              {data.name}
            </Link>
          </CardTitle>
        </div>
      </div>

      {canManage && (
        <RemoveModDialog
          modpackId={modpackId}
          modId={data.id}
          modName={data.name}
        />
      )}
    </Card>
  )
}
