import { env } from '@/env'
import { headers } from '@/services/helpers'
import type { IRelationModModpackDTO } from '../dtos'

export async function addModToModpackService(
  modpackId: string,
  modAtribute: string,
) {
  const url = `${env.VITE_API_URL}/modpacks/${modpackId}/mods`

  const res = await fetch(url, {
    method: 'POST',
    credentials: 'include',
    headers: { ...headers },
    body: JSON.stringify({ modAtribute }),
  })

  if (res.status !== 201) {
    const { error } = await res.json()
    throw new Error(error.message ?? 'We have a problem adding this mod')
  }
  return (await res.json()) as IRelationModModpackDTO
}
