import { useAppForm } from '@org/design-system/components/ui/form-tanstack'
import {
  type CreateModpackFormData,
  createModpackFormSchema,
} from '@org/validation/forms/modapack'
import { SubmitButton } from '@/components/form/submit-button'
import { TextField } from '@/components/form/text-field'

interface ModpackFormProps {
  defaultValues?: Partial<CreateModpackFormData>
  onSubmit: (data: CreateModpackFormData) => void | Promise<void>
  isLoading?: boolean
  submitText?: string
}

export function ModpackForm({
  defaultValues,
  onSubmit,
  isLoading = false,
  submitText = 'Save',
}: ModpackFormProps) {
  const form = useAppForm({
    defaultValues: {
      name: defaultValues?.name || '',
      description: defaultValues?.description || undefined,
      avatarUrl: defaultValues?.avatarUrl || undefined,
      steamUrl: defaultValues?.steamUrl || undefined,
    },
    validators: {
      onSubmit: createModpackFormSchema,
    },
    onSubmit: ({ value }) => onSubmit(value),
  })

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        e.stopPropagation()
        form.handleSubmit()
      }}
      className="flex flex-col gap-8"
    >
      <div className="flex flex-col gap-4">
        <TextField
          form={form}
          name="name"
          label="Modpack Name *"
          placeholder="My Awesome Modpack"
          inputMode="text"
        />
        <TextField
          form={form}
          name="description"
          label="Description"
          placeholder="A collection of mods for..."
          inputMode="text"
        />
        <TextField
          form={form}
          name="avatarUrl"
          label="Avatar URL"
          placeholder="https://example.com/avatar.png"
          disabled={isLoading}
          inputMode="url"
        />
        <TextField
          form={form}
          name="steamUrl"
          label="Steam Workshop URL"
          placeholder="https://steamcommunity.com/..."
          disabled={isLoading}
          inputMode="url"
        />
      </div>
      <SubmitButton
        isLoading={isLoading}
        label={submitText}
        loadingLabel="Saving..."
      />
    </form>
  )
}
