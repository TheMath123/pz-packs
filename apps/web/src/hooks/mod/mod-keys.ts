export const modKeys = {
  all: ['mods'] as const,
  list: (params: unknown) => [...modKeys.all, 'list', params] as const,
  get: (id: string) => [...modKeys.all, id] as const,
}
