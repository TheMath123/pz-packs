import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@org/design-system/components/ui/dialog'
import { toast } from '@org/design-system/components/ui/sonner'
import type { AddMemberFormData } from '@org/validation/forms/modpack'
import { useState } from 'react'
import { useAddModpackMember } from '@/hooks/members'
import { AddMemberForm } from './add-member-form'

interface AddMemberDialogProps {
  modpackId: string
  trigger: (props: React.ComponentProps<'button'>) => React.ReactElement
}

export function AddMemberDialog({ modpackId, trigger }: AddMemberDialogProps) {
  const [open, setOpen] = useState(false)
  const addMember = useAddModpackMember()

  const handleSubmit = async (data: AddMemberFormData) => {
    const result = await addMember.mutateAsync({
      modpackId,
      email: data.email,
    })

    if (!result.success) {
      console.log(result.error.message)
      toast.error(
        result.error.message || 'Failed to add member. Please try again later.',
      )
      return
    }

    toast.success('Member added successfully')
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={(props) => trigger(props)} />
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Member</DialogTitle>
          <DialogDescription>
            Add a new member to this modpack by their email address.
          </DialogDescription>
        </DialogHeader>
        <AddMemberForm
          onSubmit={handleSubmit}
          isLoading={addMember.isPending}
        />
      </DialogContent>
    </Dialog>
  )
}
