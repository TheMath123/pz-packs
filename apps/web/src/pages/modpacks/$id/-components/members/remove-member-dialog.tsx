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
import { useRemoveModpackMember } from '@/hooks/modpack'
import type { ModpackMemberWithUser } from '@/services/modpack/get-members.service'
import { MemberAvatarButton } from './member-avatar-button'

interface RemoveMemberDialogProps {
  modpackId: string
  member: ModpackMemberWithUser
  onSuccess?: () => void
}

export function RemoveMemberDialog({
  modpackId,
  member,
  onSuccess,
}: RemoveMemberDialogProps) {
  const [open, setOpen] = useState(false)
  const removeMember = useRemoveModpackMember()

  const handleRemove = async () => {
    const result = await removeMember.mutateAsync({
      modpackId,
      email: member.user.email,
    })

    if (result.success) {
      setOpen(false)
      onSuccess?.()
    }
  }

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger
        render={() => <MemberAvatarButton member={member} />}
      />
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Remove Member</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to remove{' '}
            <span className="font-semibold">
              {member.user.name || member.user.email}
            </span>{' '}
            from this modpack? This action cannot be undone.
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
