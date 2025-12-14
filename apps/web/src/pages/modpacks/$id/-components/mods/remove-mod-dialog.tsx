import { Button } from '@org/design-system/components/ui/button'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@org/design-system/components/ui/dialog'
import { TrashIcon } from '@org/design-system/components/ui/icons'
import { useState } from 'react'
import { useRemoveModFromModpack } from '@/hooks/modpack/mod/use-remove-mod-from-modpack'

interface RemoveModDialogProps {
  modpackId: string
  modId: string
  modName: string
}

export function RemoveModDialog({
  modpackId,
  modId,
  modName,
}: RemoveModDialogProps) {
  const [open, setOpen] = useState(false)
  const { mutate: removeMod, isPending } = useRemoveModFromModpack()

  const handleRemove = () => {
    removeMod(
      { modpackId, modId },
      {
        onSuccess: () => {
          setOpen(false)
        },
      },
    )
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={
          <Button
            variant="ghost"
            size="icon"
            className="text-destructive hover:text-destructive hover:bg-destructive/10"
          >
            <TrashIcon className="w-4 h-4" />
          </Button>
        }
      ></DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Remove Mod</DialogTitle>
          <DialogDescription>
            Are you sure you want to remove{' '}
            <span className="font-bold">{modName}</span> from this modpack?
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose
            render={<Button variant="outline">Cancel</Button>}
          ></DialogClose>
          <Button onClick={handleRemove} disabled={isPending}>
            {isPending ? 'Removing...' : 'Remove'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
