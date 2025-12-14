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

  if (res.status !== 204 && res.status !== 200) {
    const { error } = await res.json()
    throw new Error(error.message ?? 'We have a problem removing this mod')
  }
}
