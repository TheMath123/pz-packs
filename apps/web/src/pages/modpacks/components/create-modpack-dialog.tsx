import { Button } from '@org/design-system/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@org/design-system/components/ui/dialog'
import { PlusIcon } from '@org/design-system/components/ui/icons'
import { toast } from '@org/design-system/components/ui/sonner'
import type { CreateModpackFormData } from '@org/validation/forms/modapack'
import { useState } from 'react'
import { useCreateModpack } from '@/hooks/modpack'
import { ModpackForm } from './modpack-form'

export function CreateModpackDialog() {
  const [open, setOpen] = useState(false)
  const createModpack = useCreateModpack()

  const handleSubmit = async (data: CreateModpackFormData) => {
    const result = await createModpack.mutateAsync(data)

    if (!result.success) {
      toast.error(result.error.message ?? 'Failed to create modpack')
      return
    }

    toast.success('Modpack created successfully')
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={
          <Button>
            <PlusIcon className="mr-2 h-4 w-4" weight="bold" />
            Create Modpack
          </Button>
        }
      ></DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Create New Modpack</DialogTitle>
          <DialogDescription>
            Create a new modpack to organize your favorite mods
          </DialogDescription>
        </DialogHeader>
        <ModpackForm
          onSubmit={handleSubmit}
          isLoading={createModpack.isPending}
          submitText="Create Modpack"
        />
      </DialogContent>
    </Dialog>
  )
}
