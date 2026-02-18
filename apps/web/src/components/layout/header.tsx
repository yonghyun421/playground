'use client'

// 헤더 컴포넌트 - Record Candy 전역 네비게이션
import Link from 'next/link'
import { usePathname } from 'next/navigation'

/** 데스크톱 네비게이션 아이템 */
const NAV_LINKS = [
  { href: '/', label: '홈' },
  { href: '/search', label: '검색' },
  { href: '/archive', label: '아카이브' },
] as const

/**
 * 앱 글로벌 헤더
 * - 로고: "Record Candy 🍬"
 * - 데스크톱 네비게이션: 홈, 검색, 아카이브
 * - 모바일에서는 하단 탭 바를 사용하므로 네비게이션은 데스크톱 전용
 */
export function Header() {
  const pathname = usePathname()

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-card/80 backdrop-blur-md">
      <nav
        className="container mx-auto flex h-16 items-center justify-between px-4"
        aria-label="글로벌 네비게이션"
      >
        {/* 로고 */}
        <Link
          href="/"
          className="flex items-center gap-2 text-xl font-bold text-foreground transition-opacity duration-200 hover:opacity-80 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 rounded-lg"
          aria-label="Record Candy 홈으로 이동"
        >
          <span aria-hidden="true">🍬</span>
          <span>Record Candy</span>
        </Link>

        {/* 데스크톱 네비게이션 (모바일에서 숨김 - 하단 탭바로 대체) */}
        <div className="hidden items-center gap-6 md:flex" role="list">
          {NAV_LINKS.map(({ href, label }) => {
            // 홈(/)은 정확히 일치해야 active, 나머지는 startsWith
            const isActive =
              href === '/' ? pathname === '/' : pathname.startsWith(href)

            return (
              <Link
                key={href}
                href={href}
                role="listitem"
                className={[
                  'text-sm font-medium transition-colors duration-200',
                  'focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 rounded-lg px-1',
                  isActive
                    ? 'text-foreground font-semibold'
                    : 'text-muted-foreground hover:text-foreground',
                ].join(' ')}
                aria-current={isActive ? 'page' : undefined}
              >
                {label}
              </Link>
            )
          })}
        </div>
      </nav>
    </header>
  )
}
