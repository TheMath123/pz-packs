import { Card } from '@org/design-system/components/ui/card'

export function HomePage() {
  return (
    <div>
      <main>
        <h1>Wellcome to PZ Modpacks!</h1>
        <h2>Your gateway to the best Project Zomboid modpacks.</h2>

        <div>
          {Array.from({ length: 5 }, (_, i) => (
            <Card key={i}>
              <p>Explore the features and mods included in Modpack {i + 1}.</p>
            </Card>
          ))}
        </div>
      </main>
    </div>
  )
}
