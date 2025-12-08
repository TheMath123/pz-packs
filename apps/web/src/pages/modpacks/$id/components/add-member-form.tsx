import { useAppForm } from '@org/design-system/components/ui/form-tanstack'
import {
  type AddMemberFormData,
  addMemberFormSchema,
} from '@org/validation/forms/modapack'
import { SubmitButton, TextField } from '@/components/form'

interface AddMemberFormProps {
  onSubmit: (data: AddMemberFormData) => void | Promise<void>
  isLoading?: boolean
}

export function AddMemberForm({
  onSubmit,
  isLoading = false,
}: AddMemberFormProps) {
  const form = useAppForm({
    defaultValues: {
      email: '',
    },
    validators: {
      onSubmit: addMemberFormSchema,
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
      className="space-y-4"
    >
      <TextField
        form={form}
        name="email"
        label="Email *"
        placeholder="user@example.com"
        inputMode="email"
        disabled={isLoading}
      />

      <SubmitButton
        isLoading={isLoading}
        label="Add Member"
        loadingLabel="Adding.."
      />
    </form>
  )
}
