import { Button } from '@org/design-system/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@org/design-system/components/ui/dialog'
import { PencilIcon } from '@org/design-system/components/ui/icons'
import { useState } from 'react'
import type { IModDTO } from '@/services/mod/dtos'
import { UpdateModForm } from './update-mod-form'

interface UpdateModDialogProps {
  mod: IModDTO
}

export function UpdateModDialog({ mod }: UpdateModDialogProps) {
  const [editDialogOpen, setEditDialogOpen] = useState(false)

  return (
    <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
      <DialogTrigger
        className="aspect-square w-fit"
        render={
          <Button
            aria-label="Edit Mod"
            title="Edit Mod"
            size="icon"
            variant="ghost"
          >
            <PencilIcon className="h-4 w-4" weight="bold" />
          </Button>
        }
      />
      <DialogContent className="sm:max-w-125 overflow-y-auto max-h-[90vh]">
        <DialogHeader>
          <DialogTitle>Edit Mod</DialogTitle>
          <DialogDescription>Update mod information</DialogDescription>
        </DialogHeader>
        <UpdateModForm mod={mod} onSuccess={() => setEditDialogOpen(false)} />
      </DialogContent>
    </Dialog>
  )
}
