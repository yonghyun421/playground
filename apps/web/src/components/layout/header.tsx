import Link from 'next/link'

export function Header() {
  return (
    <header className="border-b">
      <nav className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/" className="text-xl font-bold">
          Playground
        </Link>
        <div className="flex gap-6">
          <Link href="/" className="text-gray-600 hover:text-gray-900">
            Home
          </Link>
          <Link href="/api/health" className="text-gray-600 hover:text-gray-900">
            Health
          </Link>
        </div>
      </nav>
    </header>
  )
}
