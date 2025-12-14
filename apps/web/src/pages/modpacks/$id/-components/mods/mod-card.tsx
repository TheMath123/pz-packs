import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@org/design-system/components/ui/card'
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

  console.log(data)

  return (
    <Card className="flex flex-row items-center p-0 overflow-hidden gap-0">
      <div className="relative bg-primary/30 dark:bg-primary aspect-square h-full flex items-center justify-center  text-muted-foreground/20 overflow-clip">
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
      <div className="p-2">
        <Link
          to={data.steamUrl || '#'}
          target="_blank"
          rel="noopener noreferrer"
        >
          <h1 className="text-base hover:underline wrap-break-word">
            {data.name}
          </h1>
        </Link>
        <p className="line-clamp-2 text-sm text-muted-foreground">
          {data.description}
        </p>

        {canManage && (
          <RemoveModDialog
            modpackId={modpackId}
            modId={data.id}
            modName={data.name}
          />
        )}
      </div>
    </Card>
  )
}
