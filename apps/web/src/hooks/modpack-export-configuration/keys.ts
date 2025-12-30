export const modpackExportConfigurationKeys = {
  all: ['modpack-export-configuration'] as const,
  get: (modpackId: string) =>
    [...modpackExportConfigurationKeys.all, modpackId] as const,
}
