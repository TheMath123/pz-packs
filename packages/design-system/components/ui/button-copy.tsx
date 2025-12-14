'use client'

import { cn } from '@org/design-system/lib/utils'
import { CheckIcon, CopyIcon } from '@phosphor-icons/react'
import { useEffect, useState } from 'react'
import { Button, type ButtonVariants } from './button'

interface CopyButtonProps {
  textToCopy: string
  className?: string
  classNameIcon?: string
  size?: ButtonVariants['size'] | 'iconConfig'
  variant?: ButtonVariants['variant']
  children?: React.ReactNode
  disabled?: boolean
}

export function CopyButton({
  disabled,
  textToCopy,
  className,
  classNameIcon,
  size = 'iconConfig',
  variant = 'outline',
  children,
}: CopyButtonProps) {
  const [isCopied, setIsCopied] = useState(false)

  useEffect(() => {
    if (isCopied) {
      const timer = setTimeout(() => {
        setIsCopied(false)
      }, 1000)

      return () => clearTimeout(timer)
    }
  }, [isCopied])

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(textToCopy)
      setIsCopied(true)
    } catch (err: any) {
      // log the error if needed
    }
  }

  return (
    <Button
      type="button"
      disabled={disabled}
      variant={variant}
      size={size === 'iconConfig' ? 'icon' : size}
      onClick={handleCopy}
      aria-label={isCopied ? 'Copiado!' : 'Copiar'}
      className={cn(size === 'iconConfig' && 'w-6 h-6 rounded-sm', className)}
    >
      {isCopied ? (
        <CheckIcon
          className={cn(
            size !== 'iconConfig' && children && 'mr-2',
            'w-5 h-5',
            classNameIcon,
          )}
          weight="bold"
        />
      ) : (
        <CopyIcon
          className={cn(
            size !== 'iconConfig' && children && 'mr-2',
            'w-5 h-5',
            classNameIcon,
          )}
          weight="bold"
        />
      )}
      {children && children}
    </Button>
  )
}
