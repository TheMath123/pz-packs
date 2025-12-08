import type { auth } from '@/auth'

export type User = typeof auth.$Infer.Session.user
export type Session = typeof auth.$Infer.Session
