import { authClient } from '@/lib/auth'
import type { IModpackDTO } from '@/services/modpack/dtos'

export interface CanManageModpack {
  isOwner: boolean
  isMember: boolean
}

export function useCanManageModpack(modpack?: IModpackDTO): CanManageModpack {
  const { data: session } = authClient.useSession()

  if (!session?.user?.id || !modpack) {
    return { isOwner: false, isMember: false }
  }

  const isOwner = session.user.id === modpack.owner
  const isMember =
    modpack.members?.some(
      (member) => member.userId === session.user.id && member.isActive,
    ) ?? false

  return { isOwner, isMember }
}
