import { useAppForm } from '@org/design-system/components/ui/form-tanstack'
import {
  type UpdateModFormData,
  updateModFormSchema,
} from '@org/validation/forms/mod'
import { TextAreaField, TextField } from '@/components/form'
import { SubmitButton } from '@/components/form/submit-button'
import { useUpdateMod } from '@/hooks/mod/use-update-mod'
import type { IModDTO } from '@/services/mod/dtos'

interface UpdateModFormProps {
  mod: IModDTO
  onSuccess: () => void
}

export function UpdateModForm({ mod, onSuccess }: UpdateModFormProps) {
  const updateMod = useUpdateMod()

  const form = useAppForm({
    defaultValues: {
      name: mod.name,
      description: mod.description || undefined,
      avatarUrl: mod.avatarUrl || undefined,
      steamUrl: mod.steamUrl || undefined,
    } as UpdateModFormData,
    validators: {
      onSubmit: updateModFormSchema,
    },
    onSubmit: async ({ value }) =>
      await updateMod.mutateAsync({
        id: mod.id,
        data: value,
      }),
  })

  updateMod.isSuccess && onSuccess()

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
          label="Mod Name *"
          placeholder="Mod Name"
          inputMode="text"
          disabled={updateMod.isPending}
        />
        <TextAreaField
          form={form}
          name="description"
          label="Description"
          placeholder="Mod description..."
          inputMode="text"
          disabled={updateMod.isPending}
          maxLength={20000}
        />
        <TextField
          form={form}
          name="avatarUrl"
          label="Avatar URL"
          placeholder="https://example.com/avatar.png"
          disabled={updateMod.isPending}
          inputMode="url"
        />
        <TextField
          form={form}
          name="steamUrl"
          label="Steam Workshop URL"
          placeholder="https://steamcommunity.com/..."
          disabled={updateMod.isPending}
          inputMode="url"
        />
      </div>
      <SubmitButton
        isLoading={updateMod.isPending}
        label="Save"
        loadingLabel="Saving..."
      />
    </form>
  )
}
