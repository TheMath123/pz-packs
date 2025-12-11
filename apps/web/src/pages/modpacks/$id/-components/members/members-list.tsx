import { Button } from '@org/design-system/components/ui/button'

import { CircleNotchIcon, XIcon } from '@org/design-system/components/ui/icons'
import {
  Popover,
  PopoverContent,
  PopoverPositioner,
  PopoverTrigger,
} from '@org/design-system/components/ui/popover'
import { useMembers } from '@/hooks/members'
import { AddMemberButton } from './add-member-button'
import { AddMemberDialog } from './add-member-dialog'
import { MemberAvatarButton } from './member-avatar-button'
import { RemoveMemberDialog } from './remove-member-dialog'
import { ShowRemainingMember } from './show-remaining-member'

interface MembersListProps {
  modpackId: string
  canManageMembers?: boolean
}

export function MembersList({
  modpackId,
  canManageMembers = false,
}: MembersListProps) {
  const { data: members, isLoading } = useMembers(modpackId)

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
      <div className="flex items-center gap-2 -translate-x-3">
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
    <div className="flex flex-row items-center -space-x-2">
      {visibleMembers.map((member) => (
        <RemoveMemberDialog
          key={member.id}
          member={member}
          modpackId={modpackId}
          canRemove={canManageMembers}
          trigger={(props) => <MemberAvatarButton member={member} {...props} />}
        />
      ))}

      {remainingCount > 0 && (
        <Popover>
          <PopoverTrigger
            render={(props) => (
              <ShowRemainingMember remainingCount={remainingCount} {...props} />
            )}
          />
          <PopoverPositioner className="w-48" align="end">
            <PopoverContent>
              <div className="px-2 py-1.5 text-sm font-semibold">
                All Members ({members.length})
              </div>
              {members.slice(5).map((member) => (
                <div key={member.id} className="flex items-center gap-3 p-2">
                  <MemberAvatarButton
                    member={member}
                    disabledTooltip
                    readOnly
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">
                      {member.user.name || member.user.email}
                    </p>
                    {member.user.name && (
                      <p className="text-xs truncate">{member.user.email}</p>
                    )}
                  </div>
                  <RemoveMemberDialog
                    modpackId={modpackId}
                    member={member}
                    canRemove={canManageMembers}
                    trigger={(props) => (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="hover:bg-destructive/10"
                        {...props}
                      >
                        <XIcon
                          className="text-destructive size-4"
                          weight="bold"
                        />
                      </Button>
                    )}
                  />
                </div>
              ))}
            </PopoverContent>
          </PopoverPositioner>
        </Popover>
      )}
      {canManageMembers && (
        <AddMemberDialog
          modpackId={modpackId}
          trigger={(props) => (
            <AddMemberButton className="-translate-x-2" {...props} />
          )}
        />
      )}
    </div>
  )
}
