import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { Button } from '@org/design-system/components/ui/button'
import { Card } from '@org/design-system/components/ui/card'
import { Checkbox } from '@org/design-system/components/ui/checkbox'
import {
  ArrowDownIcon,
  ArrowUpIcon,
  CaretDoubleDownIcon,
  CaretDoubleUpIcon,
  DotsSixVerticalIcon,
} from '@org/design-system/components/ui/icons'
import { Label } from '@org/design-system/components/ui/label'
import type { IModDTO } from '@/services/mod/dtos'

interface SortableModCardProps {
  item: IModDTO
  index: number
  total: number
  modConfig: Record<string, { selectedSteamModIds: string[] }>
  onMove: (index: number, direction: 'up' | 'down' | 'top' | 'bottom') => void
  onToggleSteamModId: (modId: string, steamModId: string) => void
}

export function SortableModCard({
  item,
  index,
  total,
  modConfig,
  onMove,
  onToggleSteamModId,
}: SortableModCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: item.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 1 : 0,
    opacity: isDragging ? 0.5 : 1,
    position: 'relative' as const,
  }

  return (
    <Card
      ref={setNodeRef}
      style={style}
      className="p-4 flex flex-row gap-4 items-start bg-card"
    >
      <div
        {...attributes}
        {...listeners}
        className="cursor-grab active:cursor-grabbing p-1 hover:bg-muted rounded mt-2 hidden md:block"
      >
        <DotsSixVerticalIcon
          className="w-6 h-6 text-muted-foreground"
          weight="bold"
        />
      </div>

      {item.avatarUrl ? (
        <img
          src={item.avatarUrl}
          alt={item.name}
          className="w-12 h-12 rounded-md"
        />
      ) : (
        <div className="w-12 h-12 rounded-md bg-muted flex items-center justify-center shrink-0">
          <span className="text-xs text-muted-foreground">No Img</span>
        </div>
      )}

      <div className="flex flex-col gap-2 w-full relative">
        <div className="flex justify-between items-center flex-wrap">
          <span className="font-semibold">{item.name}</span>
        </div>

        {item.steamModId && item.steamModId.length > 0 && (
          <div className="flex flex-col gap-2 pl-4 border-l-2 border-muted">
            <p className="text-sm text-muted-foreground">
              Select Mod IDs to enable:
            </p>
            <div className="flex flex-col flex-wrap gap-1">
              {item.steamModId.map((id: string) => (
                <div key={id} className="flex items-center gap-2">
                  <Checkbox
                    id={`toggle-${id}`}
                    checked={
                      modConfig[item.id]?.selectedSteamModIds?.includes(id) ??
                      true
                    }
                    onCheckedChange={() => onToggleSteamModId(item.id, id)}
                  />
                  <Label
                    htmlFor={`toggle-${id}`}
                    className="text-sm break-all font-light leading-relaxed"
                  >
                    {id}
                  </Label>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="md:absolute md:top-1/2 md:-translate-y-1/2 md:right-2 gap-2 flex flex-row mt-2 md:mt-0">
          <Button
            size="icon"
            variant="outline"
            onClick={() => onMove(index, 'top')}
            disabled={index === 0}
          >
            <CaretDoubleUpIcon className="w-4 h-4" weight="bold" />
          </Button>
          <Button
            size="icon"
            variant="outline"
            onClick={() => onMove(index, 'up')}
            disabled={index === 0}
          >
            <ArrowUpIcon className="w-4 h-4" weight="bold" />
          </Button>
          <Button
            size="icon"
            variant="outline"
            onClick={() => onMove(index, 'down')}
            disabled={index === total - 1}
          >
            <ArrowDownIcon className="w-4 h-4" weight="bold" />
          </Button>
          <Button
            size="icon"
            variant="outline"
            onClick={() => onMove(index, 'bottom')}
            disabled={index === total - 1}
          >
            <CaretDoubleDownIcon className="w-4 h-4" weight="bold" />
          </Button>
        </div>
      </div>
    </Card>
  )
}
