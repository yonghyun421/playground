import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Header } from '@/components/layout/header'
import { MobileNav } from '@/components/layout/mobile-nav'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Record Candy 🍬',
  description: '영화와 책의 달콤한 기록',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ko">
      <body className={inter.className}>
        <div className="flex min-h-screen flex-col">
          <Header />
          <main className="flex-1">{children}</main>
          {/* 모바일 하단 탭 바 (데스크톱에서 자동으로 숨겨짐) */}
          <MobileNav />
        </div>
      </body>
    </html>
  )
}
