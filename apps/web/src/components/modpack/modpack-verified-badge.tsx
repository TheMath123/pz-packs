import { CheckIcon } from '@org/design-system/components/ui/icons'
import { cn } from '@org/design-system/lib/utils'

export function ModpackVerifiedBadge({ className }: { className?: string }) {
  const msg = 'This modpack is verified by the PZ Packs team.'
  return (
    <div
      className={cn(
        'group relative flex items-center justify-center rounded-full bg-blue-500/80 shadow-xs shadow-shadow/80 p-1',
        className,
      )}
    >
      <CheckIcon className="w-2.5 h-2.5 text-white" weight="bold" />
      <div className="absolute flex flex-col items-start gap-1 bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-background text-popover-foreground text-xs rounded-md shadow-md opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap border-2 border-border z-50">
        <span className="text-foreground text-base font-medium">{msg}</span>
      </div>
    </div>
  )
}
