import { UserPlusIcon } from '@org/design-system/components/ui/icons'
import { cn } from '@org/design-system/lib/utils'

export function AddMemberButton({
  className,
  ...props
}: React.ComponentProps<'button'>) {
  return (
    <button
      type="button"
      className={cn(
        'group relative inline-flex h-10 w-10 items-center justify-center rounded-full border-2 border-border ml-2 cursor-pointer hover:border-2 hover:border-border hover:bg-accent active:scale-95 transition-all bg-background hover:shadow-xs text-muted-foreground hover:text-white',
        className,
      )}
      title="Add member"
      {...props}
    >
      <UserPlusIcon className="h-4 w-4" weight="bold" />
    </button>
  )
}
