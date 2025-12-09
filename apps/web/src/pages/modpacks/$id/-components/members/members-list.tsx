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
import { useModpackMembers } from '@/hooks/members'
import { getInitials } from '@/utils/string'
import { AddMemberButton } from './add-member-button'
import { AddMemberDialog } from './add-member-dialog'
import { RemoveMemberDialog } from './remove-member-dialog'

interface MembersListProps {
  modpackId: string
  canManageMembers?: boolean
}

export function MembersList({
  modpackId,
  canManageMembers = false,
}: MembersListProps) {
  const { data: members, isLoading } = useModpackMembers(modpackId)

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
        {canManageMembers && (
          <AddMemberDialog
            modpackId={modpackId}
            trigger={(props) => <AddMemberButton {...props} />}
          />
        )}
      </div>
    )
  }

  const visibleMembers = members.slice(0, 5)
  const remainingCount = members.length - 5

  return (
    <div className="flex flex-row gap-2 items-center">
      <div className="flex items-center -space-x-2">
        {visibleMembers.map((member) => (
          <RemoveMemberDialog
            key={member.id}
            member={member}
            modpackId={modpackId}
            canRemove={canManageMembers}
          />
        ))}
      </div>
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
                  <RemoveMemberDialog
                    modpackId={modpackId}
                    member={member}
                    canRemove={canManageMembers}
                  />
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenuPositioner>
        </DropdownMenu>
      )}
      {canManageMembers && (
        <AddMemberDialog
          modpackId={modpackId}
          trigger={(props) => <AddMemberButton {...props} />}
        />
      )}
    </div>
  )
}
