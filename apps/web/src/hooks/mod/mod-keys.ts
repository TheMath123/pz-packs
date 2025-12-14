export const modKeys = {
  all: ['mods'] as const,
  list: (params: any) => [...modKeys.all, 'list', params] as const,
}
