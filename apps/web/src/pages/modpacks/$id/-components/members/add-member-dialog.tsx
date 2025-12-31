import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@org/design-system/components/ui/dialog'
import { useState } from 'react'
import { AddMemberForm } from './add-member-form'

interface AddMemberDialogProps {
  modpackId: string
  trigger: (props: React.ComponentProps<'button'>) => React.ReactElement
  className?: string
}

export function AddMemberDialog({ modpackId, trigger }: AddMemberDialogProps) {
  const [open, setOpen] = useState(false)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={(props) => trigger(props)} />
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Member</DialogTitle>
          <DialogDescription>
            Add a new member to this modpack by their email address. This
            discord e-mail must be associated with an existing account.
          </DialogDescription>
        </DialogHeader>
        <AddMemberForm modpackId={modpackId} onSuccess={() => setOpen(false)} />
      </DialogContent>
    </Dialog>
  )
}
