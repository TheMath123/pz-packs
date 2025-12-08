import { Button } from '@org/design-system/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@org/design-system/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@org/design-system/components/ui/dialog'
import {
  PencilIcon,
  TrashIcon,
  UserCirclePlusIcon,
} from '@org/design-system/components/ui/icons'
import { Label } from '@org/design-system/components/ui/label'
import { Switch } from '@org/design-system/components/ui/switch'
import type {
  AddMemberFormData,
  UpdateModpackFormData,
} from '@org/validation/forms/modapack'
import { useNavigate, useParams } from '@tanstack/react-router'
import { useState } from 'react'
import {
  useAddModpackMember,
  useModpackDetails,
  useRemoveModpackMember,
  useUpdateModpack,
} from '@/hooks/modpack'
import { AddMemberForm } from '@/pages/modpacks/$id/components/add-member-form'
import { ModpackForm } from '@/pages/modpacks/components/modpack-form'

export function ModpackDetailsPage() {
  const { id } = useParams({ strict: false }) as { id: string }
  const navigate = useNavigate()
  const { data: modpack, isLoading, error } = useModpackDetails(id)

  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [addMemberDialogOpen, setAddMemberDialogOpen] = useState(false)

  const updateModpack = useUpdateModpack()
  const addMember = useAddModpackMember()
  const removeMember = useRemoveModpackMember()

  const handleUpdateSubmit = async (data: UpdateModpackFormData) => {
    const result = await updateModpack.mutateAsync({
      id,
      data: {
        name: data.name,
        description: data.description,
        avatarUrl: data.avatarUrl,
        steamUrl: data.steamUrl,
      },
    })

    if (result.success) {
      setEditDialogOpen(false)
    }
  }

  const handleTogglePublic = async () => {
    if (!modpack) return

    await updateModpack.mutateAsync({
      id,
      data: {
        isPublic: !modpack.isPublic,
      },
    })
  }

  const handleAddMember = async (data: AddMemberFormData) => {
    const result = await addMember.mutateAsync({
      modpackId: id,
      email: data.email,
    })

    if (result.success) {
      setAddMemberDialogOpen(false)
    }
  }

  const handleRemoveMember = async (memberId: string) => {
    await removeMember.mutateAsync({
      modpackId: id,
      memberId,
    })
  }

  if (isLoading) {
    return (
      <div className="container mx-auto py-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-muted rounded w-1/3" />
          <div className="h-4 bg-muted rounded w-1/2" />
          <div className="h-64 bg-muted rounded" />
        </div>
      </div>
    )
  }

  if (error || !modpack) {
    return (
      <div className="container mx-auto py-8">
        <div className="text-center">
          <p className="text-destructive mb-4">
            {error?.message || 'Modpack not found'}
          </p>
          <Button
            onClick={() =>
              navigate({
                to: '/modpacks',
                search: {
                  page: 1,
                  limit: 12,
                  sortBy: 'createdAt',
                  sortOrder: 'desc',
                },
              })
            }
          >
            Back
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-8">
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold mb-2">{modpack.name}</h1>
            {modpack.description && (
              <p className="text-muted-foreground">{modpack.description}</p>
            )}
          </div>
          <div className="flex gap-2">
            <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
              <DialogTrigger
                render={
                  <Button>
                    <PencilIcon className="mr-2 h-4 w-4" weight="bold" />
                    Edit
                  </Button>
                }
              />
              <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                  <DialogTitle>Edit Modpack</DialogTitle>
                  <DialogDescription>
                    Update your modpack information
                  </DialogDescription>
                </DialogHeader>
                <ModpackForm
                  defaultValues={{
                    name: modpack.name,
                    description: modpack.description || '',
                    avatarUrl: modpack.avatarUrl || '',
                    steamUrl: modpack.steamUrl || '',
                  }}
                  onSubmit={handleUpdateSubmit}
                  isLoading={updateModpack.isPending}
                  submitText="Save Changes"
                />
              </DialogContent>
            </Dialog>
          </div>
        </div>

        <div className="flex items-center gap-4 mb-6">
          <div className="flex items-center space-x-2">
            <Switch
              id="public"
              checked={modpack.isPublic}
              onCheckedChange={handleTogglePublic}
              disabled={updateModpack.isPending}
            />
            <Label htmlFor="public">Public Modpack</Label>
          </div>
          {modpack.steamUrl && (
            <a
              href={modpack.steamUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-primary hover:underline"
            >
              View on Steam Workshop
            </a>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Mods</CardTitle>
            <CardDescription>Mods included in this modpack</CardDescription>
          </CardHeader>
          <CardContent>
            {modpack.mods && modpack.mods.length > 0 ? (
              <ul className="space-y-2">
                {modpack.mods.map((mod, index) => (
                  <li key={index} className="text-sm">
                    {mod}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-muted-foreground">No mods added yet</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Members</CardTitle>
              <CardDescription>
                People who have access to this modpack
              </CardDescription>
            </div>
            <Dialog
              open={addMemberDialogOpen}
              onOpenChange={setAddMemberDialogOpen}
            >
              <DialogTrigger>
                <Button size="sm" variant="outline">
                  <UserCirclePlusIcon className="h-4 w-4" weight="bold" />
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add Member</DialogTitle>
                  <DialogDescription>
                    Invite someone to collaborate on this modpack
                  </DialogDescription>
                </DialogHeader>
                <AddMemberForm
                  onSubmit={handleAddMember}
                  isLoading={addMember.isPending}
                />
              </DialogContent>
            </Dialog>
          </CardHeader>
          <CardContent>
            {modpack.members && modpack.members.length > 0 ? (
              <ul className="space-y-2">
                {modpack.members.map((member) => (
                  <li
                    key={member.id}
                    className="flex items-center justify-between text-sm"
                  >
                    <span>{member.userId}</span>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleRemoveMember(member.id)}
                      disabled={removeMember.isPending}
                    >
                      <TrashIcon
                        className="h-4 w-4 text-destructive"
                        weight="bold"
                      />
                    </Button>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-muted-foreground">
                No members yet. You can add collaborators to help manage this
                modpack.
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
