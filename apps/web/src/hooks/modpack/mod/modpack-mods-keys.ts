export const modpackModsKeys = {
  all: ['modpack-mods'] as const,
  list: (modpackId: string, params?: any) =>
    [...modpackModsKeys.all, 'list', modpackId, params] as const,
}
