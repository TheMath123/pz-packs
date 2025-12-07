import { Button } from '@org/design-system/components/ui/button'
import { LogOut, Theme } from '@org/design-system/components/ui/icons'

import { useTheme } from '@org/design-system/providers'
import { auth } from '@/lib/auth'

export function SiteHeader() {
  return (
    <header className="container flex justify-end items-center my-4">
      <nav className="flex flex-row gap-3 items-center">
        <ThemeButton />
        <UserMenu />
      </nav>
    </header>
  )
}

function ThemeButton() {
  const { toggleTheme } = useTheme()
  return (
    <Button onClick={toggleTheme} variant="ghost" size="icon">
      <Theme className="size-4.5" />
    </Button>
  )
}

function UserMenu() {
  const { isPending, data } = auth.useSession()
  if (isPending) return null

  if (!data) {
    return (
      <Button
        onClick={() =>
          auth.signIn.social({
            provider: 'discord',
            callbackURL: location.origin,
          })
        }
      >
        Login With Discord
      </Button>
    )
  }

  return (
    <div className="flex flex-row gap-2 items-center">
      <img
        src={data.user.image ?? ''}
        alt={data.user.name ?? undefined}
        className="rounded-radius w-8 h-8 border-2 border-border shadow"
      />
      <span className="font-medium">{data.user.name}</span>
      <Button onClick={() => auth.signOut()}>
        <LogOut />
        Logout
      </Button>
    </div>
  )
}
