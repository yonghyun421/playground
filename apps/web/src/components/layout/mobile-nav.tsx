'use client'

// MobileNav: 모바일 하단 탭 바 컴포넌트
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { HomeIcon, SearchIcon, ArchiveIcon } from 'lucide-react'

/** 탭 네비게이션 아이템 정의 */
const NAV_ITEMS = [
  {
    href: '/',
    label: '홈',
    icon: HomeIcon,
  },
  {
    href: '/search',
    label: '검색',
    icon: SearchIcon,
  },
  {
    href: '/archive',
    label: '아카이브',
    icon: ArchiveIcon,
  },
] as const

/**
 * 모바일 하단 탭 바
 * - 모바일 전용 (데스크톱에서 숨김)
 * - 현재 경로에 따라 활성 탭 하이라이트
 */
export function MobileNav() {
  const pathname = usePathname()

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50 md:hidden"
      aria-label="모바일 하단 탭 네비게이션"
    >
      {/* 배경 블러 + 테두리 */}
      <div className="border-t border-border bg-card/80 backdrop-blur-md">
        <div className="flex items-center justify-around px-2 py-2 pb-safe">
          {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
            // 홈(/)는 정확히 일치해야 active, 나머지는 startsWith로 체크
            const isActive =
              href === '/' ? pathname === '/' : pathname.startsWith(href)

            return (
              <Link
                key={href}
                href={href}
                className={[
                  'flex flex-1 flex-col items-center gap-1 py-1 rounded-xl transition-all duration-200',
                  'focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
                  isActive
                    ? 'text-primary'
                    : 'text-muted-foreground hover:text-foreground',
                ].join(' ')}
                aria-current={isActive ? 'page' : undefined}
              >
                <Icon
                  className={[
                    'h-5 w-5 transition-all duration-200',
                    isActive ? 'scale-110' : '',
                  ].join(' ')}
                  aria-hidden="true"
                />
                <span
                  className={[
                    'text-xs font-medium',
                    isActive ? 'font-semibold' : '',
                  ].join(' ')}
                >
                  {label}
                </span>
              </Link>
            )
          })}
        </div>
      </div>
    </nav>
  )
}
