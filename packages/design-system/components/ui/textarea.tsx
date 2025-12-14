import { cn } from '@org/design-system/lib/utils'
import type * as React from 'react'

export type TextAreaProps = React.ComponentProps<'textarea'>

function Textarea({ className, ...props }: TextAreaProps) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        'px-4 py-2 w-full border-2 rounded border-border shadow-md transition focus:outline-hidden focus:shadow-xs placeholder:text-muted-foreground',
        className,
      )}
      {...props}
    />
  )
}

export { Textarea }
