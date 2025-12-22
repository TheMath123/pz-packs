import { env } from '@/env'
import type { ArchiveSuccess } from '@/services/dtos'
import { headers } from '@/services/helpers'

export async function removeModpackMemberService(
  modpackId: string,
  email: string,
) {
  const url = `${env.VITE_API_URL}/modpacks/${modpackId}/members`
  const res = await fetch(url, {
    method: 'DELETE',
    credentials: 'include',
    headers: { ...headers },
    body: JSON.stringify({ email }),
  })

  const data = await res.json()
  if (res.status !== 200) {
    throw new Error(data.message ?? 'We have a problem adding this member')
  }
  return data as ArchiveSuccess
}
