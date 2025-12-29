import {
  closestCenter,
  DndContext,
  type DragEndEvent,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core'
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import { Button } from '@org/design-system/components/ui/button'
import { useEffect, useState } from 'react'
import { useListModpackMods } from '@/hooks/modpack/mod/use-list-modpack-mods'
import { useUpdateModpack } from '@/hooks/modpack/use-update-modpack'
import type { IModDTO } from '@/services/mod/dtos'
import type { IModpackDTO } from '@/services/modpack/dtos'
import { SortableModCard } from './sortable-mod-card'

interface ReorderModsListProps {
  modpack: IModpackDTO
  onClose: () => void
}

export function ReorderModsList({ modpack, onClose }: ReorderModsListProps) {
  const { data: modsData, isLoading } = useListModpackMods(
    { limit: 1000 },
    modpack.id,
  )
  const { mutate: updateModpack, isPending } = useUpdateModpack()

  const [orderedMods, setOrderedMods] = useState<IModDTO[]>([])
  const [modConfig, setModConfig] = useState<
    Record<string, { selectedSteamModIds: string[] }>
  >({})

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  )

  useEffect(() => {
    if (modsData?.data) {
      const mods = [...modsData.data]

      // Apply existing order
      if (modpack.metadata?.modsOrder) {
        const orderMap = new Map(
          modpack.metadata.modsOrder.map((id, index) => [id, index]),
        )
        mods.sort((a, b) => {
          const indexA = orderMap.get(a.id) ?? Infinity
          const indexB = orderMap.get(b.id) ?? Infinity
          return indexA - indexB
        })
      }

      setOrderedMods(mods)

      // Apply existing config
      if (modpack.metadata?.modConfig) {
        setModConfig(modpack.metadata.modConfig)
      } else {
        // Initialize with all selected by default if no config
        const initialConfig: Record<string, { selectedSteamModIds: string[] }> =
          {}
        mods.forEach((m) => {
          if (m.steamModId) {
            initialConfig[m.id] = { selectedSteamModIds: m.steamModId }
          }
        })
        setModConfig(initialConfig)
      }
    }
  }, [modsData, modpack.metadata])

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event

    if (over && active.id !== over.id) {
      setOrderedMods((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id)
        const newIndex = items.findIndex((item) => item.id === over.id)

        return arrayMove(items, oldIndex, newIndex)
      })
    }
  }

  const moveMod = (
    index: number,
    direction: 'up' | 'down' | 'top' | 'bottom',
  ) => {
    const newMods = [...orderedMods]
    const mod = newMods[index]
    newMods.splice(index, 1)

    if (direction === 'up') newMods.splice(Math.max(0, index - 1), 0, mod)
    else if (direction === 'down')
      newMods.splice(Math.min(newMods.length, index + 1), 0, mod)
    else if (direction === 'top') newMods.unshift(mod)
    else if (direction === 'bottom') newMods.push(mod)

    setOrderedMods(newMods)
  }

  const toggleSteamModId = (modId: string, steamModId: string) => {
    setModConfig((prev) => {
      const current = prev[modId]?.selectedSteamModIds || []
      const newSelected = current.includes(steamModId)
        ? current.filter((id) => id !== steamModId)
        : [...current, steamModId]

      return {
        ...prev,
        [modId]: { selectedSteamModIds: newSelected },
      }
    })
  }

  const handleSave = () => {
    const modsOrder = orderedMods.map((m) => m.id)
    updateModpack(
      {
        id: modpack.id,
        data: {
          metadata: {
            modsOrder,
            modConfig,
          },
        },
      },
      {
        onSuccess: () => {
          onClose()
        },
      },
    )
  }

  if (isLoading) return <div>Loading...</div>

  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-bold">Reorder & Configure Export</h3>
        <div className="flex gap-2">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={isPending}>
            Save Configuration
          </Button>
        </div>
      </div>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={orderedMods.map((m) => m.id)}
          strategy={verticalListSortingStrategy}
        >
          <div className="flex flex-col gap-2">
            {orderedMods.map((item, index) => (
              <SortableModCard
                key={item.id}
                item={item}
                index={index}
                total={orderedMods.length}
                modConfig={modConfig}
                onMove={moveMod}
                onToggleSteamModId={toggleSteamModId}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>
    </div>
  )
}
