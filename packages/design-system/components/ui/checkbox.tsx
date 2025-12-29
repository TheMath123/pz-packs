import { Checkbox as CheckboxPrimitive } from '@base-ui/react/checkbox'
import { cn } from '@org/design-system/lib/utils'
import { CheckIcon } from '@phosphor-icons/react'

function Checkbox({ className, ...props }: CheckboxPrimitive.Root.Props) {
  return (
    <CheckboxPrimitive.Root
      data-slot="checkbox"
      className={cn(
        'peer border-input dark:bg-input/30 data-checked:bg-primary data-checked:text-primary-foreground dark:data-checked:bg-primary data-checked:border-primary focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive size-4 shrink-0 shadow-xs transition-shadow outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50 border-2 border-border hover:shadow-sm hover:cursor-pointer rounded-xs',
        className,
      )}
      {...props}
    >
      <CheckboxPrimitive.Indicator
        data-slot="checkbox-indicator"
        className="size-full flex items-center justify-center text-current transition-none"
      >
        <CheckIcon className="size-3.5" weight="bold" />
      </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
  )
}

export { Checkbox }
