import { Card } from '@playground/ui'
import { Button } from '@playground/ui'

export default function HomePage() {
  const packages = [
    {
      name: '@playground/ui',
      description: 'Shared React components with Tailwind styling',
    },
    {
      name: '@playground/db',
      description: 'Drizzle ORM setup with SQLite database',
    },
    {
      name: '@playground/utils',
      description: 'Shared utility functions and helpers',
    },
  ]

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="mx-auto max-w-4xl text-center">
        <h1 className="mb-4 text-5xl font-bold">Playground</h1>
        <p className="mb-12 text-xl text-gray-600">
          A fullstack TypeScript monorepo featuring Next.js 15, Drizzle ORM, and shared packages
        </p>

        <div className="mb-12 grid gap-6 md:grid-cols-3">
          {packages.map((pkg) => (
            <Card key={pkg.name}>
              <h3 className="mb-2 text-lg font-semibold">{pkg.name}</h3>
              <p className="text-sm text-gray-600">{pkg.description}</p>
            </Card>
          ))}
        </div>

        <div className="flex justify-center gap-4">
          <Button variant="primary">Get Started</Button>
          <Button variant="secondary">View Docs</Button>
        </div>
      </div>
    </div>
  )
}
