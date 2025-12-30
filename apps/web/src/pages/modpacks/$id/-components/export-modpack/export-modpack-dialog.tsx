import { Button } from '@org/design-system/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@org/design-system/components/ui/dialog'
import { ExportIcon } from '@org/design-system/components/ui/icons'
import { useState } from 'react'
import type { IModpackDTO } from '@/services/modpack/dtos'
import { ExportModpackForm } from './export-modpack-form'

interface AddMemberDialogProps {
  modpack: IModpackDTO
  className?: string
}

export function ExportModpackDialog({ modpack }: AddMemberDialogProps) {
  const [open, setOpen] = useState(false)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        className={'w-fit gap-2'}
        render={
          <Button
            variant="outline"
            aria-label="Download server file"
            className="bg-background"
          >
            <ExportIcon className="h-5 w-5" weight="bold" />
            Export
          </Button>
        }
      />
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Export Server File</DialogTitle>
          <DialogDescription>
            Choose the Project Zomboid version to export the server file for the
            modpack <span className="font-semibold">{modpack.name}</span>.
            Waiting for the exporting process to finish.
          </DialogDescription>
        </DialogHeader>
        <ExportModpackForm
          modpackId={modpack.id}
          onSuccess={() => setOpen(false)}
        />
      </DialogContent>
    </Dialog>
  )
}
