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
import { toast } from '@org/design-system/components/ui/sonner'
import { useState } from 'react'
import { useRemoveModpackMember } from '@/hooks/members'
import type { ModpackMemberWithUser } from '@/services/modpack/get-members.service'
import { MemberAvatarButton } from './member-avatar-button'

interface RemoveMemberDialogProps {
  modpackId: string
  member: ModpackMemberWithUser
  canRemove?: boolean
  disabledTooltip?: boolean
  onSuccess?: () => void
}

export function RemoveMemberDialog({
  modpackId,
  member,
  canRemove = false,
  disabledTooltip,
  onSuccess,
}: RemoveMemberDialogProps) {
  const [open, setOpen] = useState(false)
  const removeMember = useRemoveModpackMember()

  const handleRemove = async () => {
    const result = await removeMember.mutateAsync({
      modpackId,
      email: member.user.email,
    })

    if (!result.success) {
      console.log(result)
      toast.error(
        result.error.message ||
          'Failed to remove member. Please try again later.',
      )
      return
    }

    toast.success('Member removed successfully')
    setOpen(false)
    onSuccess?.()
  }

  if (!canRemove) {
    return <MemberAvatarButton member={member} readOnly />
  }

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger
        render={(props) => (
          <MemberAvatarButton
            disabledTooltip={disabledTooltip}
            member={member}
            {...props}
          />
        )}
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
