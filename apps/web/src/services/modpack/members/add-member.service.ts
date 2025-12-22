import { env } from '@/env'
import { headers } from '@/services/helpers'
import type { IModpackMemberDTO } from '../dtos'

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

  const data = await res.json()
  if (res.status !== 201) {
    throw new Error(data.message ?? 'We have a problem adding this member')
  }
  return data as IModpackMemberDTO
}
