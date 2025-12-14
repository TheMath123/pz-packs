import { env } from '@/env'
import { headers } from '../../helpers'

interface ImportModpackParams {
  id: string
  data: {
    steamUrl: string
  }
}

interface ImportResponseSuccess {
  message: string
  jobId: string
}

export async function importModpackService({
  id,
  data: { steamUrl },
}: ImportModpackParams) {
  const url = `${env.VITE_API_URL}/modpacks/${id}/import`

  const res = await fetch(url, {
    method: 'POST',
    credentials: 'include',
    headers: {
      ...headers,
    },
    body: JSON.stringify({ steamUrl }),
  })

  const data = await res.json()

  if (res.status !== 200) {
    const { error } = data
    throw new Error(error.message ?? 'We have a problem updating this modpack')
  }

  return data as ImportResponseSuccess
}
