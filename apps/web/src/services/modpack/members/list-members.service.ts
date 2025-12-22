import { env } from '@/env'
import { headers } from '@/services/helpers'
import type { IMemberDTO } from '../dtos'

export async function listModpackMembersService(modpackId: string) {
  const url = `${env.VITE_API_URL}/modpacks/${modpackId}/members`

  const res = await fetch(url, {
    method: 'GET',
    credentials: 'include',
    headers: { ...headers },
  })

  const data = await res.json()
  if (res.status !== 200) {
    throw new Error(data.message ?? 'We have a problem listing the members')
  }

  return data as IMemberDTO[]
}
