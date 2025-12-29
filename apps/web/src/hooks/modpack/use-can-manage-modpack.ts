import { authClient } from '@/lib/auth'
import type { IModpackDTO } from '@/services/modpack/dtos'

export function useCanManageModpack(modpack?: IModpackDTO) {
  const { data: session } = authClient.useSession()

  if (!session?.user?.id || !modpack) {
    return false
  }

  const isOwner = session.user.id === modpack.owner
  const isMember = modpack.members?.some(
    (member) => member.userId === session.user.id && member.isActive,
  )

  return isOwner || isMember
}
