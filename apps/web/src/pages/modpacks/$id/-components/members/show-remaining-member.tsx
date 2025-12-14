interface ShowRemainingMemberProps {
  remainingCount: number
}
export function ShowRemainingMember({
  remainingCount,
  ...props
}: ShowRemainingMemberProps) {
  return (
    <button
      type="button"
      className="relative inline-flex h-10 w-10 items-center justify-center rounded-full border-2 border-border bg-background hover:bg-accent transition-colors cursor-pointer hover:shadow-xs text-muted-foreground hover:text-white"
      {...props}
    >
      <span className="text-xs font-medium">+{remainingCount}</span>
    </button>
  )
}
