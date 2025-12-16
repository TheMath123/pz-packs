import { useRender } from '@base-ui-components/react/use-render'
import { mergeElementProps, renderElement } from '@org/design-system/lib/baseui'
import { cn } from '@org/design-system/lib/utils'
import { cva, type VariantProps } from 'class-variance-authority'
import type * as React from 'react'

export interface BadgeProps
  extends useRender.ComponentProps<'span'>,
    VariantProps<typeof badgeVariants> {
  asChild?: boolean
  dotClassName?: string
  disabled?: boolean
}

export interface BadgeButtonProps
  extends useRender.ComponentProps<'button'>,
    VariantProps<typeof badgeButtonVariants> {
  asChild?: boolean
}

export type BadgeDotProps = React.HTMLAttributes<HTMLSpanElement>

const badgeVariants = cva('font-semibold rounded', {
  variants: {
    variant: {
      default: 'bg-muted text-muted-foreground',
      outline: 'outline-2 outline-foreground text-foreground',
      solid: 'bg-foreground text-background',
      surface: 'outline-2 bg-primary text-primary-foreground',
      destructive:
        'border-transparent bg-destructive text-white [a&]:hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60',
    },
    size: {
      sm: 'px-2 py-1 text-xs',
      md: 'px-2.5 py-1.5 text-sm',
      lg: 'px-3 py-2 text-base',
      icon: 'p-2',
    },
  },
  defaultVariants: {
    variant: 'default',
    size: 'md',
  },
})

const badgeButtonVariants = cva(
  'cursor-pointer transition-all inline-flex items-center justify-center leading-none size-3.5 [&>svg]:opacity-100! [&>svg]:size-3.5 p-0 rounded-md -me-0.5 opacity-60 hover:opacity-100 shadow-xs shadow-shadow/80',
  {
    variants: {
      variant: {
        default: '',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
)

function Badge({
  render,
  asChild = false,
  children,
  className,
  variant,
  size,
  disabled,
  ...props
}: BadgeProps) {
  const defaultProps = {
    className: cn(badgeVariants({ variant, size }), className),
    'data-slot': 'badge',
  }

  const element = renderElement(asChild, children, render || <span />)
  const fnProps = mergeElementProps(asChild, children, defaultProps, props)

  return useRender({
    render: element,
    props: fnProps,
  })
}

function BadgeButton({
  render,
  asChild = false,
  children,
  className,
  variant,
  ...props
}: BadgeButtonProps) {
  const defaultProps = {
    className: cn(badgeButtonVariants({ variant, className })),
    role: 'button' as const,
    'data-slot': 'badge-button',
  }

  const el = renderElement(
    asChild,
    children,
    render || <button type="button" />,
  )
  const fnProps = mergeElementProps(asChild, children, defaultProps, props)

  const element = useRender({
    render: el,
    props: fnProps,
  })

  return element
}

function BadgeDot({ className, ...props }: BadgeDotProps) {
  return (
    <span
      data-slot="badge-dot"
      className={cn(
        'size-1.5 rounded-full bg-[currentColor] opacity-75',
        className,
      )}
      {...props}
    />
  )
}

export { Badge, BadgeButton, BadgeDot, badgeVariants }
