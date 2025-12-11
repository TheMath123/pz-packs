import { useAppForm } from '@org/design-system/components/ui/form-tanstack'
import {
  type UpdateModpackFormData,
  updateModpackFormSchema,
} from '@org/validation/forms/modpack'
import { SubmitButton } from '@/components/form/submit-button'
import { SwitchField } from '@/components/form/switch-field'
import { TextField } from '@/components/form/text-field'
import { useUpdateModpack } from '@/hooks'
import type { ModpackWithMembers } from '@/services/modpack/get-modpack-details.service'

interface UpdateModpackFormProps {
  modpack: ModpackWithMembers
  onSuccess: () => void
}

export function UpdateModpackForm({
  modpack,
  onSuccess,
}: UpdateModpackFormProps) {
  const updateModpack = useUpdateModpack()

  const form = useAppForm({
    defaultValues: {
      name: modpack?.name || '',
      description: modpack?.description || undefined,
      avatarUrl: modpack?.avatarUrl || undefined,
      steamUrl: modpack?.steamUrl || undefined,
      isPublic: modpack?.isPublic || false,
    } as UpdateModpackFormData,
    validators: {
      onSubmit: updateModpackFormSchema,
    },
    onSubmit: async ({ value }) =>
      await updateModpack.mutateAsync({
        id: modpack.id,
        data: value,
      }),
  })

  updateModpack.isSuccess && onSuccess()

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
          disabled={updateModpack.isPending}
          inputMode="url"
        />
        <TextField
          form={form}
          name="steamUrl"
          label="Steam Workshop URL"
          placeholder="https://steamcommunity.com/..."
          disabled={updateModpack.isPending}
          inputMode="url"
        />
        <SwitchField
          form={form}
          name="isPublic"
          label="Public"
          description="If enabled, your modpack will be visible to everyone."
          disabled={updateModpack.isPending}
        />
      </div>
      <SubmitButton
        isLoading={updateModpack.isPending}
        label="Save"
        loadingLabel="Saving..."
      />
    </form>
  )
}
