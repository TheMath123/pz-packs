import { Anchor } from '../anchor'
import { NavUser } from './nav-user'

export function AppHeader() {
  return (
    <header className="container flex justify-end items-center my-4">
      <nav className="flex flex-row gap-3 items-center">
        <Anchor href="/">Home</Anchor>
        <Anchor href="/modpacks">My Modpacks</Anchor>
        <NavUser />
      </nav>
    </header>
  )
}
