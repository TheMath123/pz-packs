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

const splitByNewLine = (val?: string) =>
  val
    ? val
        .split('\n')
        .map((s) => s.trim())
        .filter(Boolean)
    : []

export function UpdateModForm({ mod, onSuccess }: UpdateModFormProps) {
  const updateMod = useUpdateMod()

  const form = useAppForm({
    defaultValues: {
      name: mod.name,
      description: mod.description || undefined,
      avatarUrl: mod.avatarUrl || undefined,
      steamUrl: mod.steamUrl || undefined,
      mapFolders: mod.mapFolders?.join('\n'),
      requiredMods: mod.requiredMods?.join('\n'),
      steamModId: mod.steamModId?.join('\n'),
      workshopId: mod.workshopId,
    } as UpdateModFormData,
    validators: {
      onSubmit: updateModFormSchema,
    },
    onSubmit: async ({ value }) => {
      await updateMod.mutateAsync({
        id: mod.id,
        data: {
          ...value,
          mapFolders: splitByNewLine(value.mapFolders),
          requiredMods: splitByNewLine(value.requiredMods),
          steamModId: splitByNewLine(value.steamModId),
        },
      })
    },
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
        <TextField
          form={form}
          name="workshopId"
          label="Workshop ID"
          placeholder="123456789"
          inputMode="numeric"
          disabled={updateMod.isPending}
        />
        <TextAreaField
          form={form}
          name="steamModId"
          label="Mod IDs"
          placeholder="One per line"
          inputMode="text"
          disabled={updateMod.isPending}
          description="One Mod Id per line"
        />
        <TextAreaField
          form={form}
          name="mapFolders"
          label="Map Folders"
          placeholder="One per line"
          inputMode="text"
          disabled={updateMod.isPending}
          description="One Map Folder per line"
        />
        <TextAreaField
          form={form}
          name="requiredMods"
          label="Required Mods (Workshop IDs)"
          placeholder="One per line"
          inputMode="text"
          disabled={updateMod.isPending}
          description="One Workshop ID per line"
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
