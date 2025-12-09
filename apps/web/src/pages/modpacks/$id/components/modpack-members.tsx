import type { ModpackWithMembers } from '@/services/modpack/get-modpack-details.service'

interface ModpackMembers {
  modpackId: string
  modpack: ModpackWithMembers
}

export function ModpackMembers({ modpackId, modpack }: ModpackMembers) {
  return <div>Modpack Members Component</div>
}
