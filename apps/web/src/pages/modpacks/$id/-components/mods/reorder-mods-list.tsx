import { Button } from '@org/design-system/components/ui/button'
import { Card } from '@org/design-system/components/ui/card'
import { Checkbox } from '@org/design-system/components/ui/checkbox'
import {
  ArrowDownIcon,
  ArrowUpIcon,
  CaretDoubleDownIcon,
  CaretDoubleUpIcon,
  PlaceholderIcon,
} from '@org/design-system/components/ui/icons'
import { useEffect, useState } from 'react'
import { useListModpackMods } from '@/hooks/modpack/mod/use-list-modpack-mods'
import { useUpdateModpack } from '@/hooks/modpack/use-update-modpack'
import type { IModDTO } from '@/services/mod/dtos'
import type {
  IModpackDTO,
  IRelationModModpackDTO,
} from '@/services/modpack/dtos'

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

      <div className="flex flex-col gap-2">
        {orderedMods.map((item, index) => (
          <Card key={item.id} className="p-4 flex flex-row gap-4 items-start">
            {item.avatarUrl ? (
              <img
                src={item.avatarUrl}
                alt={item.name}
                className="w-12 h-12 rounded-md"
              />
            ) : (
              <div className="w-12 h-12 rounded-md bg-muted flex items-center justify-center">
                <PlaceholderIcon
                  className="w-6 h-6 text-muted-foreground"
                  weight="bold"
                />
              </div>
            )}
            <div className="flex flex-col gap-2 w-full">
              <div className="flex justify-between items-center">
                <span className="font-semibold">{item.name}</span>
                <div className="flex gap-2">
                  <Button
                    size="icon"
                    variant="outline"
                    onClick={() => moveMod(index, 'top')}
                    disabled={index === 0}
                  >
                    <CaretDoubleUpIcon className="w-4 h-4" weight="bold" />
                  </Button>
                  <Button
                    size="icon"
                    variant="outline"
                    onClick={() => moveMod(index, 'up')}
                    disabled={index === 0}
                  >
                    <ArrowUpIcon className="w-4 h-4" weight="bold" />
                  </Button>
                  <Button
                    size="icon"
                    variant="outline"
                    onClick={() => moveMod(index, 'down')}
                    disabled={index === orderedMods.length - 1}
                  >
                    <ArrowDownIcon className="w-4 h-4" weight="bold" />
                  </Button>
                  <Button
                    size="icon"
                    variant="outline"
                    onClick={() => moveMod(index, 'bottom')}
                    disabled={index === orderedMods.length - 1}
                  >
                    <CaretDoubleDownIcon className="w-4 h-4" weight="bold" />
                  </Button>
                </div>
              </div>

              {item.steamModId && item.steamModId.length > 0 && (
                <div className=" flex flex-col gap-2 pl-4 border-l-2 border-muted">
                  <p className="text-sm text-muted-foreground">
                    Select Mod IDs to enable:
                  </p>
                  <div className="flex flex-col flex-wrap gap-1">
                    {item.steamModId.map((id: string) => (
                      <div key={id} className="flex items-center gap-1">
                        <Checkbox
                          checked={
                            modConfig[item.id]?.selectedSteamModIds?.includes(
                              id,
                            ) ?? true
                          }
                          onCheckedChange={() => toggleSteamModId(item.id, id)}
                        />
                        <span className="text-sm">{id}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}
