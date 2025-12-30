import { Button } from '@org/design-system/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@org/design-system/components/ui/dialog'
import { FilePlusIcon } from '@org/design-system/components/ui/icons'
import { useState } from 'react'
import { AddModForm } from './add-mod-form'

interface AddModDialogProps {
  modpackId: string
}

export function AddModDialog({ modpackId }: AddModDialogProps) {
  const [open, setOpen] = useState(false)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={
          <Button className="flex flex-row items-center tracking-wide">
            <FilePlusIcon className="w-5 h-5 mr-1" weight="bold" />
            Add Mod
          </Button>
        }
      ></DialogTrigger>
      <DialogContent className="sm:max-w-125">
        <DialogHeader>
          <DialogTitle>Add Mod</DialogTitle>
          <DialogDescription>Add a mod to your modpack</DialogDescription>
        </DialogHeader>
        <AddModForm modpackId={modpackId} onSuccess={() => setOpen(false)} />
      </DialogContent>
    </Dialog>
  )
}
