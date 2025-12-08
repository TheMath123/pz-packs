import { cn } from '@org/design-system/lib/utils'
import { Link } from '@tanstack/react-router'

interface AnchorProps {
  href: string
  children: React.ReactNode
  className?: string
}

export function Anchor({ href, children, className }: AnchorProps) {
  return (
    <Link
      to={href}
      className={cn(
        'font-medium hover:underline hover:text-primary underline-offset-4 decoration-2 transition-all duration-200 ease-in-out',
        className,
      )}
    >
      {children}
    </Link>
  )
}
