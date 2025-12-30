import { Button } from '@org/design-system/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@org/design-system/components/ui/dialog'
import { ArrowSquareInIcon } from '@org/design-system/components/ui/icons'
import { useState } from 'react'
import { ImportModpackForm } from './import-modpack-form'

interface ImportModpackDialogProps {
  modpackId: string
}

export function ImportModpackDialog({ modpackId }: ImportModpackDialogProps) {
  const [open, setOpen] = useState(false)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={
          <Button
            variant="outline"
            className="flex flex-row items-center tracking-wide"
          >
            <ArrowSquareInIcon className="w-5 h-5 mr-1" weight="bold" />
            Import from Steam
          </Button>
        }
      ></DialogTrigger>
      <DialogContent className="sm:max-w-125">
        <DialogHeader>
          <DialogTitle>Import Modpack</DialogTitle>
          <DialogDescription>
            Import mods from a Steam Workshop Collection
          </DialogDescription>
        </DialogHeader>
        <ImportModpackForm
          modpackId={modpackId}
          onSuccess={() => setOpen(false)}
        />
      </DialogContent>
    </Dialog>
  )
}
