import { env } from '@/env'
import { headers } from '@/services/helpers'

export async function removeModFromModpackService(
  modpackId: string,
  modId: string,
) {
  const url = `${env.VITE_API_URL}/modpacks/${modpackId}/mods/${modId}`

  const res = await fetch(url, {
    method: 'DELETE',
    credentials: 'include',
    headers: { ...headers },
  })

  const data = await res.json()
  if (res.status !== 204 && res.status !== 200) {
    throw new Error(data.message ?? 'We have a problem removing this mod')
  }

  return data
}
