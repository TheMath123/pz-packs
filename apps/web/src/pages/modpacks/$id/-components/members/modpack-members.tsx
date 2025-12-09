import { ModpackMembersAvatars } from '@/pages/modpacks/$id/-components/members/modpack-members-avatars'

interface ModpackMembersProps {
  modpackId: string
}

export function ModpackMembers({ modpackId }: ModpackMembersProps) {
  return (
    <div>
      <h1 className="font-medium">Members</h1>
      <ModpackMembersAvatars modpackId={modpackId} />
    </div>
  )
}
