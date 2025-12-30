import { t } from 'elysia'

export const saveExportConfigurationSchema = t.Object({
  modsOrder: t.Optional(t.Array(t.String())),
  modConfig: t.Optional(
    t.Record(
      t.String(),
      t.Object({
        selectedSteamModIds: t.Array(t.String()),
      }),
    ),
  ),
})
