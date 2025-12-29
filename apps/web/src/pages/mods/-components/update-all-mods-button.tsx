import { Button } from '@org/design-system/components/ui/button'
import { ArrowsClockwiseIcon } from '@org/design-system/components/ui/icons'
import { useUpdateAllMods } from '@/hooks/mod/use-update-all-mods'

export function UpdateAllModsButton() {
  const updateAllMods = useUpdateAllMods()

  return (
    <Button
      variant="outline"
      onClick={() => updateAllMods.mutate()}
      disabled={updateAllMods.isPending}
    >
      <ArrowsClockwiseIcon
        className={`mr-2 h-4 w-4 ${updateAllMods.isPending ? 'animate-spin' : ''}`}
      />
      {updateAllMods.isPending ? 'Updating...' : 'Update All Mods'}
    </Button>
  )
}
