import type { DModpackMember } from '@org/database/schemas'
import { env } from '@/env'
import { headers } from '../../helpers'

export async function addModpackMemberService(
  modpackId: string,
  email: string,
) {
  const url = `${env.VITE_API_URL}/modpacks/${modpackId}/members`

  const res = await fetch(url, {
    method: 'POST',
    credentials: 'include',
    headers: { ...headers },
    body: JSON.stringify({ email, permission: ['read'] }),
  })

  if (res.status !== 201) {
    const { error } = await res.json()
    throw new Error(error.message ?? 'We have a problem adding this member')
  }
  return (await res.json()) as DModpackMember
}
