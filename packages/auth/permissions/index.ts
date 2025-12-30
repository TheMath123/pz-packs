import { createAccessControl } from 'better-auth/plugins/access'

const statement = {
  modpack: [
    'create',
    'read',
    'update',
    'archive',
    'export',
    'add-mod',
    'remove-mod',
    'import',
    'manager-members',
  ],
  mod: ['create', 'read', 'update', 'remove', 'update-all'],
  notification: ['read', 'update'],
  admin: ['access'],
} as const

const ac = createAccessControl(statement)

const admin = ac.newRole({
  modpack: [...statement.modpack],
  mod: [...statement.mod],
  notification: [...statement.notification],
  admin: [...statement.admin],
})

const user = ac.newRole({
  modpack: [
    'create',
    'read',
    'update',
    'archive',
    'export',
    'add-mod',
    'remove-mod',
    'import',
    'manager-members',
  ],
  mod: ['create', 'read', 'update', 'remove'],
  notification: ['read', 'update'],
})

export type Permission = {
  [K in keyof typeof statement]: {
    resource: K
    action: (typeof statement)[K][number] | (typeof statement)[K][number][]
  }
}[keyof typeof statement]

export { ac, admin, user }
