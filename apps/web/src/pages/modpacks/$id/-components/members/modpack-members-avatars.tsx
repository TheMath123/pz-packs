import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@org/design-system/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuPositioner,
  DropdownMenuTrigger,
} from '@org/design-system/components/ui/dropdown-menu'
import { CircleNotchIcon } from '@org/design-system/components/ui/icons'
import { useAddModpackMember, useModpackMembers } from '@/hooks/modpack'

import { getInitials } from '@/utils/string'
import { AddMemberButton } from './add-member-button'
import { RemoveMemberDialog } from './remove-member-dialog'

interface ModpackMembersAvatarsProps {
  modpackId: string
  onAddMember?: () => void
}

export function ModpackMembersAvatars({
  modpackId,
  onAddMember,
}: ModpackMembersAvatarsProps) {
  const { data: members, isLoading } = useModpackMembers(modpackId)
  const addModpackMember = useAddModpackMember()

  const handleAddMemberSubmit = async (data: AddMemberModpackFormData) => {
    const result = await addModpackMember.mutateAsync({
      id: modpackId,
      data: {
        name: data.name,
        description: data.description,
        avatarUrl: data.avatarUrl,
        steamUrl: data.steamUrl,
      },
    })

    if (result.success) {
      setEditDialogOpen(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center gap-2">
        <CircleNotchIcon className="h-4 w-4 animate-spin" weight="bold" />
        <span className="text-sm text-muted-foreground">
          Loading members...
        </span>
      </div>
    )
  }

  if (!members || members.length === 0) {
    return (
      <div className="flex items-center gap-2">
        <span className="text-sm text-muted-foreground">No members yet</span>
        {onAddMember && <AddMemberButton onAddMember={onAddMember} />}
      </div>
    )
  }

  const visibleMembers = members.slice(0, 5)
  const remainingCount = members.length - 5

  return (
    <div className="flex items-center -space-x-2">
      {visibleMembers.map((member) => (
        <RemoveMemberDialog
          key={member.id}
          member={member}
          modpackId={modpackId}
        />
      ))}
      {remainingCount > 0 && (
        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <button
                type="button"
                className="relative inline-flex h-10 w-10 items-center justify-center rounded-full border-2 border-background bg-muted hover:bg-muted/80 transition-colors"
              >
                <span className="text-xs font-medium">+{remainingCount}</span>
              </button>
            }
          />
          <DropdownMenuPositioner align="end">
            <DropdownMenuContent className="w-64">
              <div className="px-2 py-1.5 text-sm font-semibold">
                All Members ({members.length})
              </div>
              {members.slice(5).map((member) => (
                <DropdownMenuItem
                  key={member.id}
                  className="flex items-center gap-3 p-2"
                >
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={member.user.image || undefined} />
                    <AvatarFallback>
                      {getInitials(member.user.name || member.user.email)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">
                      {member.user.name || member.user.email}
                    </p>
                    {member.user.name && (
                      <p className="text-xs text-muted-foreground truncate">
                        {member.user.email}
                      </p>
                    )}
                  </div>
                  <RemoveMemberDialog modpackId={modpackId} member={member} />
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenuPositioner>
        </DropdownMenu>
      )}
      ''
      {onAddMember && <AddMemberButton onAddMember={onAddMember} />}
    </div>
  )
}
