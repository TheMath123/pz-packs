import { Button } from '@org/design-system/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@org/design-system/components/ui/dialog'
import { PlusIcon } from '@org/design-system/components/ui/icons'
import { useState } from 'react'
import { CreateModpackForm } from './create-modpack-form'

export function CreateModpackDialog() {
  const [open, setOpen] = useState(false)
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={
          <Button>
            <PlusIcon className="mr-2 h-4 w-4" weight="bold" />
            Create Modpack
          </Button>
        }
      ></DialogTrigger>
      <DialogContent className="sm:max-w-125 overflow-y-auto max-h-[90vh]">
        <DialogHeader>
          <DialogTitle>Create New Modpack</DialogTitle>
          <DialogDescription>
            Create a new modpack to organize your favorite mods
          </DialogDescription>
        </DialogHeader>
        <CreateModpackForm onSuccess={() => setOpen(false)} />
      </DialogContent>
    </Dialog>
  )
}
