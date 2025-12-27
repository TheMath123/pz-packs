import {
  type TextAreaProps,
  Textarea,
} from '@org/design-system/components/ui/textarea'
import { cn } from '@org/design-system/lib/utils'

interface TextAreaFieldProps extends Omit<TextAreaProps, 'form' | 'onChange'> {
  name: string
  label?: string
  placeholder?: string
  description?: string
  form: any
}

export function TextAreaField({
  form,
  name,
  label,
  placeholder,
  description,
  maxLength = 1024,
  rows = 6,
  ...inputProps
}: TextAreaFieldProps) {
  return (
    <form.AppField name={name}>
      {(field: any) => (
        <form.Item className="relative">
          {label && <field.Label>{label}</field.Label>}
          <field.Control>
            <Textarea
              placeholder={placeholder}
              name={field.name}
              value={field.state.value as string}
              onBlur={field.handleBlur}
              onChange={(e) => field.handleChange(e.target.value)}
              rows={rows}
              className={
                field.state.value?.length >= maxLength
                  ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                  : ''
              }
              {...inputProps}
            />
          </field.Control>
          <div className="text-muted-foreground text-sm absolute bottom-2 right-3 font-medium bg-background/80 rounded-md">
            <span
              className={cn(
                (field.state.value?.length || 0) > maxLength * 0.5 &&
                  'text-yellow-500',
                (field.state.value?.length || 0) > maxLength * 0.9 &&
                  'text-orange-500',
                (field.state.value?.length || 0) >= maxLength && 'text-red-500',
              )}
            >
              {field.state.value?.length || 0}
            </span>
            <span>/{maxLength}</span>
          </div>
          {description && <field.Description>{description}</field.Description>}
          <field.Message />
        </form.Item>
      )}
    </form.AppField>
  )
}
