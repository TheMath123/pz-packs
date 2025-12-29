import { env } from '@/env'
import { headers } from '../helpers'

export async function updateAllModsService() {
  const url = `${env.VITE_API_URL}/mods/update-all`

  const res = await fetch(url, {
    method: 'POST',
    credentials: 'include',
    headers: { ...headers },
  })

  const data = await res.json()

  if (res.status !== 200) {
    throw new Error(data.error?.message ?? 'We have a problem listing the tags')
  }

  return data
}
