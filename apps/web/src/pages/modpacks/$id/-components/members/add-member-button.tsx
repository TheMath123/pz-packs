import { UserPlusIcon } from '@org/design-system/components/ui/icons'

export function AddMemberButton({ onAddMember }: { onAddMember: () => void }) {
  return (
    <button
      type="button"
      onClick={onAddMember}
      className="relative inline-flex h-10 w-10 items-center justify-center rounded-full border-2 border-dashed border-muted-foreground/25 hover:border-muted-foreground/50 hover:bg-muted/50 transition-colors ml-2"
      title="Add member"
    >
      <UserPlusIcon className="h-4 w-4 text-muted-foreground" weight="bold" />
    </button>
  )
}
