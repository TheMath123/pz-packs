import type { DModpack } from '@org/database/schemas'
import { Button } from '@org/design-system/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@org/design-system/components/ui/card'
import { SteamLogoIcon } from '@org/design-system/components/ui/icons'
import { Link, linkOptions, useNavigate } from '@tanstack/react-router'

interface ModpackCardProps {
  data: DModpack
}

export function ModpackCard({ data }: ModpackCardProps) {
  const navigate = useNavigate()
  return (
    <Card
      className="cursor-pointer hover:shadow-lg transition-shadow duration-200 ease-in-out"
      onClick={() =>
        navigate({
          from: '/modpacks',
          to: '/modpacks/$id',
          params: { id: data.id },
        })
      }
    >
      <CardHeader className="flex flex-row items-start gap-4">
        {data.avatarUrl ? (
          <img
            src={data.avatarUrl}
            alt={data.name}
            width={48}
            height={48}
            className="w-[120px] rounded-md flex"
          />
        ) : null}
        <div className="flex flex-col gap-2">
          <CardTitle>{data.name}</CardTitle>
          <CardDescription>{data.description}</CardDescription>
        </div>
      </CardHeader>
      <CardContent>
        <CardFooter className="justify-between">
          <span className="text-sm font-medium">
            {data.mods?.length ?? 0} mods
          </span>
          {data.steamUrl && (
            <Link to={data.steamUrl} target="_blank">
              <Button size="icon" variant="ghost">
                <SteamLogoIcon className="w-6 h-6" weight="bold" />
              </Button>
            </Link>
          )}
        </CardFooter>
      </CardContent>
    </Card>
  )
}
