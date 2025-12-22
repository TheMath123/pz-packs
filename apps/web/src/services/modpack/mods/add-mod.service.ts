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

  const data = await res.json()
  console.log(res)
  if (res.status !== 200) {
    throw new Error(data.message ?? 'We have a problem adding this mod')
  }
  return data as IRelationModModpackDTO
}
