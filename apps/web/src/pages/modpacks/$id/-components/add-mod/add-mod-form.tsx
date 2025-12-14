import { useAppForm } from '@org/design-system/components/ui/form-tanstack'
import { addModInModpackSchema } from '@org/validation/forms/mod'
import { useEffect } from 'react'
import { SubmitButton, TextField } from '@/components/form'
import { useAddModInModpack } from '@/hooks/modpack/mod'

interface AddModFormProps {
  onSuccess: () => void
  modpackId: string
}

export function AddModForm({ onSuccess, modpackId }: AddModFormProps) {
  const addModInModpack = useAddModInModpack()
  const form = useAppForm({
    defaultValues: {
      modAtribute: '',
    },
    validators: {
      onSubmit: addModInModpackSchema,
    },
    onSubmit: async ({ value }) =>
      await addModInModpack.mutateAsync({
        modpackId,
        modAtribute: value.modAtribute,
      }),
  })

  useEffect(() => {
    if (addModInModpack.isSuccess) {
      form.reset()
      onSuccess()
    }
  }, [addModInModpack.isSuccess])

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
        name="modAtribute"
        label="Workshop ID or Steam URL *"
        placeholder="Enter the mod's Workshop ID or Steam URL"
        inputMode="text"
        disabled={addModInModpack.isPending}
      />

      <SubmitButton
        isLoading={addModInModpack.isPending}
        label="Add Mod"
        loadingLabel="Adding.."
      />
    </form>
  )
}
