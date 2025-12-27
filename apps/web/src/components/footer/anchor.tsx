import { cn } from '@org/design-system/lib/utils'

interface AnchorProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  children: React.ReactNode
  href: string
  className?: string
}

export function Anchor({ children, href, className, ...props }: AnchorProps) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className={cn(
        'inline-flex gap-2 hover:text-foreground hover:underline active:underline active:scale-90 transition-all duration-200 ease-in-out',
        className,
      )}
      {...props}
    >
      {children}
    </a>
  )
}
