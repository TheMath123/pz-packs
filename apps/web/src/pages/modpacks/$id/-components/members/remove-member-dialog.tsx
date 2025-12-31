import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@org/design-system/components/ui/alert-dialog'
import { useState } from 'react'
import { useRemoveModpackMember } from '@/hooks/members'
import type { IMemberDTO } from '@/services/modpack/dtos'
import { MemberAvatarButton } from './member-avatar-button'

interface RemoveMemberDialogProps {
  modpackId: string
  member: IMemberDTO
  canRemove?: boolean
  trigger: (props: React.ComponentProps<'button'>) => React.ReactElement
}

export function RemoveMemberDialog({
  modpackId,
  member,
  canRemove = false,
  trigger,
}: RemoveMemberDialogProps) {
  const [open, setOpen] = useState(false)
  const removeMember = useRemoveModpackMember()

  const handleRemove = async () => {
    await removeMember.mutateAsync({
      modpackId,
      email: member.user.email,
    })
  }

  if (!canRemove) {
    return <MemberAvatarButton member={member} readOnly />
  }

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger render={(props) => trigger(props)} />
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Remove Member</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to remove{' '}
            <span className="font-semibold">{member.user.name}</span> from this
            modpack?
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={removeMember.isPending}>
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleRemove}
            disabled={removeMember.isPending}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {removeMember.isPending ? 'Removing...' : 'Remove'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
