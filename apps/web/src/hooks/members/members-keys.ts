export const memberKeys = {
  all: ['members'] as const,
  lists: (modpackId: string) => [...memberKeys.all, modpackId] as const,
  get: (modpackId: string) => [...memberKeys.all, modpackId] as const,
}
