import { useRender } from '@base-ui-components/react'
import { mergeElementProps, renderElement } from '@org/design-system/lib/baseui'
import { cn } from '@org/design-system/lib/utils'
import { cva, type VariantProps } from 'class-variance-authority'

const buttonVariants = cva(
  'font-head transition-all rounded outline-hidden cursor-pointer duration-200 font-medium flex items-center',
  {
    variants: {
      variant: {
        default:
          'shadow-md hover:shadow active:shadow-none bg-primary text-primary-foreground border-2 border-black transition hover:translate-y-1 active:translate-y-2 active:translate-x-1 hover:bg-primary-hover',
        secondary:
          'shadow-md hover:shadow active:shadow-none bg-secondary shadow-primary text-secondary-foreground border-2 border-black transition hover:translate-y-1 active:translate-y-2 active:translate-x-1 hover:bg-secondary-hover',
        outline:
          'shadow-md hover:shadow active:shadow-none bg-transparent border-2 transition hover:translate-y-1 active:translate-y-2 active:translate-x-1',
        link: 'bg-transparent hover:underline',
        ghost: 'bg-transparent hover:bg-primary/10',
      },
      size: {
        sm: 'px-3 py-1 text-sm shadow hover:shadow-none',
        md: 'px-4 py-1.5 text-base',
        lg: 'px-6 lg:px-8 py-2 lg:py-3 text-md lg:text-lg',
        icon: 'p-2',
      },
    },
    defaultVariants: {
      size: 'md',
      variant: 'default',
    },
  },
)

interface ButtonProps extends useRender.ComponentProps<'button'> {
  variant?: VariantProps<typeof buttonVariants>['variant']
  size?: VariantProps<typeof buttonVariants>['size']
  asChild?: boolean
}

function Button(props: ButtonProps) {
  const {
    className,
    size,
    variant,
    render,
    asChild = false,
    children,
    ...restProps
  } = props

  const element = renderElement(asChild, children, render)

  const defaultProps = {
    className: cn(buttonVariants({ className, size, variant })),
    'data-slot': 'button',
    type: 'button',
  }

  const fnProps = mergeElementProps(asChild, children, defaultProps, restProps)

  return useRender({
    defaultTagName: 'button',
    render: element,
    props: fnProps,
  })
}

export { Button, buttonVariants }
