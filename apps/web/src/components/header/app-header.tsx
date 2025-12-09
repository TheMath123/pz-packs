import { useTheme } from '@org/design-system/providers'
import { Link } from '@tanstack/react-router'
import { auth } from '@/lib/auth'
import { Anchor } from '../anchor'
import { NavUser } from './nav-user'

export function AppHeader() {
  const { theme } = useTheme()
  const { data: session } = auth.useSession()

  return (
    <header className="container flex justify-between items-center my-4">
      <Link
        to="/"
        className="hover:scale-95 active:scale-110 transition-all duration-200 ease-in-out flex flex-row gap-2 items-center"
      >
        <img
          src={
            theme === 'dark'
              ? '/brand/pz-packs-logo-dark.svg'
              : '/brand/pz-packs-logo.svg'
          }
          alt="PZ Packs"
          className="h-16"
        />
        <h1 className="font-bold text-2xl">PZ Packs</h1>
      </Link>
      <div className="flex flex-row gap-3 items-center">
        {session ? (
          <nav className="flex flex-row gap-3 items-center">
            <Anchor href="/">Home</Anchor>
            <Anchor href="/modpacks">My Modpacks</Anchor>
          </nav>
        ) : null}
        <NavUser />
      </div>
    </header>
  )
}
