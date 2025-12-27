import {
  GithubLogoIcon,
  LifebuoyIcon,
} from '@org/design-system/components/ui/icons'
import { Anchor } from './anchor'

export function AppFooter() {
  return (
    <footer className="container mx-auto py-4 text-center text-sm text-muted-foreground flex flex-col gap-6 justify-between">
      <nav className="flex flex-col gap-2 self-end">
        <Anchor
          href="https://discord.gg/AzGnT9yF2a"
          aria-label="Request Support"
          title="Request Support"
        >
          <LifebuoyIcon
            className="size-4.5 text-popover-foreground"
            weight="bold"
          />
          Support
        </Anchor>
        <Anchor
          href="https://github.com/Greens-Organization/pz-packs"
          aria-label="View Code in Github"
          title="View Code in Github"
        >
          <GithubLogoIcon
            className="size-4.5 text-popover-foreground"
            weight="bold"
          />
          Github
        </Anchor>
      </nav>
      <div className="flex flex-row gap-4 w-full  justify-between flex-wrap">
        <div>
          Made by{' '}
          <a
            href="https://discord.gg/AzGnT9yF2a"
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:text-primary"
          >
            Greens Group
          </a>
        </div>
        <div>
          &copy; 2025 - {new Date().getFullYear()} | PZ Packs. All rights
          reserved.
        </div>
      </div>
    </footer>
  )
}
