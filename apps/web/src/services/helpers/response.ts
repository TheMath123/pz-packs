export async function failure(res: Response, backendError = false) {
  let message = 'Internal server error'

  try {
    const json = await res.json()
    if (json.message) {
      message = json.message as string
    } else {
      message = json.error as string
    }
  } catch {}
  return { success: false, error: { message }, status: res.status } as const
}

export async function success<T>(res: Response) {
  const body = await res.json()

  return {
    success: true,
    data: body as T,
  } as const
}
