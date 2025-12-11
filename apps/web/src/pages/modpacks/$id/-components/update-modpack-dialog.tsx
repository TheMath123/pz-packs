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
import type { ModpackWithMembers } from '@/services/modpack/get-modpack-details.service'
import { UpdateModpackForm } from './update-modpack-form'

interface UpdateModpackFormProps {
  modpack: ModpackWithMembers
}

export function UpdateModpackDialog({ modpack }: UpdateModpackFormProps) {
  const [editDialogOpen, setEditDialogOpen] = useState(false)

  return (
    <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
      <DialogTrigger
        render={
          <Button size="icon" className="w-fit h-fit">
            <PencilIcon className="mr-2 h-4 w-4" weight="bold" />
            Edit
          </Button>
        }
      />
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Edit Modpack</DialogTitle>
          <DialogDescription>Update your modpack information</DialogDescription>
        </DialogHeader>
        <UpdateModpackForm
          modpack={modpack}
          onSuccess={() => setEditDialogOpen(false)}
        />
      </DialogContent>
    </Dialog>
  )
}
