import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@org/design-system/components/ui/avatar'
import { XIcon } from '@org/design-system/components/ui/icons'
import { cn } from '@org/design-system/lib/utils'
import type { ModpackMemberWithUser } from '@/services/modpack/get-members.service'
import { getInitials } from '@/utils/string'

interface MemberAvatarButtonProps {
  member: ModpackMemberWithUser
}
export function MemberAvatarButton({ member }: MemberAvatarButtonProps) {
  return (
    <button
      type="button"
      className={cn('hover:', 'group relative cursor-pointer active:scale-95 ')}
    >
      <div className="size-full opacity-0 group-hover:opacity-100 absolute top-0 right-0 bg-black/5 backdrop-blur-sm z-20 rounded-md flex items-center justify-center border-2">
        <XIcon className="text-destructive size-4" weight="bold" />
      </div>
      <Avatar className="h-10 w-10 hover:z-10 transition-all border-2 border-border shadow-sm">
        <AvatarImage src={member.user.image || undefined} />
        <AvatarFallback className="size-full rounded-none">
          {getInitials(member.user.name || member.user.email)}
        </AvatarFallback>
      </Avatar>
      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-background text-popover-foreground text-xs rounded shadow-md opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap border-2 border-border z-50">
        {member.user.name || member.user.email}
      </div>
    </button>
  )
}
