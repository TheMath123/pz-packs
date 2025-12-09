import { auth } from '@/lib/auth'

export function useCanManageModpack(ownerId: string) {
  const { data: session } = auth.useSession()

  if (!session?.user?.id) {
    return false
  }

  return session.user.id === ownerId
}
