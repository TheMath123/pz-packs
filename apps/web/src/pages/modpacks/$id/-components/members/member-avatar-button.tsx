import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@org/design-system/components/ui/avatar'
import { XIcon } from '@org/design-system/components/ui/icons'
import { cn } from '@org/design-system/lib/utils'
import type { IMemberDTO } from '@/services/modpack/dtos'
import { getInitials } from '@/utils/string'

interface MemberAvatarButtonProps extends React.ComponentProps<'button'> {
  member: IMemberDTO
  readOnly?: boolean
  isAuthor?: boolean
  disabledTooltip?: boolean
}
export function MemberAvatarButton({
  member,
  readOnly = false,
  className,
  isAuthor = false,
  disabledTooltip = false,
  ...props
}: MemberAvatarButtonProps) {
  return (
    <button
      type="button"
      className={cn(
        'group relative active:scale-95',
        !readOnly && 'cursor-pointer hover:z-10',
        readOnly && 'cursor-default active:scale-100',
        className,
      )}
      {...props}
    >
      {!readOnly && (
        <div className="size-full opacity-0 group-hover:opacity-100 absolute top-0 right-0 bg-black/5 backdrop-blur-sm z-20 rounded-full flex items-center justify-center border-2">
          <XIcon className="text-destructive size-4" weight="bold" />
        </div>
      )}
      <Avatar className="h-10 w-10 hover:z-10 transition-all border-2 border-border group-hover:shadow-xs">
        <AvatarImage src={member.user.image || undefined} />
        <AvatarFallback className="size-full">
          {getInitials(member.user.name)}
        </AvatarFallback>
      </Avatar>
      {!disabledTooltip && (
        <div className="absolute flex flex-col items-start gap-1 bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-background text-popover-foreground text-xs rounded-md shadow-md opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap border-2 border-border z-50">
          <span className="text-base font-medium">{member.user.name}</span>
          {member.permission[0] === 'owner' ? (
            <span className="text-muted-foreground font-semibold">Author</span>
          ) : (
            <span className="text-muted-foreground font-medium">Member</span>
          )}
        </div>
      )}
    </button>
  )
}
