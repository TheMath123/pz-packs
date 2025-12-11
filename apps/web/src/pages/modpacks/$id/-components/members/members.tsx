import { MembersList } from './members-list'

interface MembersProps {
  modpackId: string
  canManageMembers?: boolean
}

export function Members({ modpackId, canManageMembers = false }: MembersProps) {
  return (
    <div className="flex flex-col gap-2 items-start">
      <MembersList modpackId={modpackId} canManageMembers={canManageMembers} />
    </div>
  )
}
