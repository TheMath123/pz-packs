import { Button } from '@org/design-system/components/ui/button'
import { cn } from '@org/design-system/lib/utils'

interface SubmitButtonProps {
  isLoading?: boolean
  label: string | React.ReactNode
  loadingLabel?: React.ReactNode
  className?: string
}
export function SubmitButton({
  isLoading = false,
  label,
  loadingLabel,
  className,
}: SubmitButtonProps) {
  return (
    <Button
      type="submit"
      className={cn('w-full', className)}
      disabled={isLoading}
    >
      {isLoading ? loadingLabel || 'Saving...' : label}
    </Button>
  )
}
