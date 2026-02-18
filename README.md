# Playground

Fullstack side project monorepo for rapid prototyping and experimentation.

## Record Candy 🍬

영화와 책의 달콤한 감상 기록 앱. 감상한 작품의 기억을 달콤하게 기록하고 시각적으로 확인할 수 있습니다.

### 주요 기능

- **작품 검색**: TMDB(영화) + 카카오 책 검색(도서) API 연동
- **감상 기록 CRUD**: 평점(1-10 캔디), 감정 태그, 한줄평, 감상일
- **아카이브**: 필터(전체/영화/도서) + 정렬(최신순/오래된순/평점순)
- **시각화 컬렉션**:
  - RecordSpineStack: 파스텔 색상 가로 바가 세로로 쌓이는 책등 시각화
  - TicketCollection: 영화 티켓이 어지럽게 쌓인 더미 효과
  - Bookshelf: 나무 재질 선반 위에 책이 정렬된 책장 효과
- **반응형 디자인**: 모바일/태블릿/데스크톱 대응

### 페이지 구성

| 경로 | 설명 |
|------|------|
| `/` | 홈 - 통계 카드 + RecordSpineStack 최근 기록 |
| `/search` | 작품 검색 + 기록 작성 모달 |
| `/archive` | 전체 아카이브 (필터/정렬/시각화) |
| `/records/[id]` | 기록 상세 + 수정/삭제 |

### API 키 설정

```bash
# apps/web/.env.local
NEXT_PUBLIC_TMDB_API_KEY=your_tmdb_api_key
NEXT_PUBLIC_KAKAO_REST_API_KEY=your_kakao_rest_api_key
```

## 기술 스택

| 카테고리 | 도구 |
|----------|------|
| 패키지 관리 | pnpm 10 + Turborepo 2 |
| 프론트엔드 | Next.js 15 + React 19 + Tailwind CSS 4 |
| UI 컴포넌트 | shadcn/ui + Framer Motion |
| 상태 관리 | Zustand (persist 미들웨어, localStorage) |
| 폼 처리 | React Hook Form + Zod |
| DB / ORM | Drizzle ORM + SQLite |
| 검증 | Zod 3 |
| 테스트 | Vitest 3 + Playwright |
| 코드 품질 | ESLint 9 + Prettier 3 + TypeScript 5.7 strict |
| Git 훅 | Lefthook (pre-commit: lint + typecheck) |

## 프로젝트 구조

```
playground/
├── apps/
│   └── web/                    # Next.js 15 풀스택 앱 (App Router)
│       ├── src/app/            # 페이지 (홈, 검색, 아카이브, 기록상세)
│       ├── src/components/     # shadcn/ui + 커스텀 컴포넌트
│       ├── src/lib/api/        # TMDB, 카카오 책 검색 API 클라이언트
│       └── src/lib/store/      # Zustand 스토어 (record, filter, search)
├── packages/
│   ├── ui/                     # 공유 컴포넌트 라이브러리
│   │   └── src/components/record-candy/  # Record Candy 전용 UI
│   ├── db/                     # Drizzle ORM + SQLite
│   ├── utils/                  # 공유 유틸리티 + Record Candy 타입/필터/정렬
│   ├── typescript-config/      # 공유 TypeScript 설정
│   └── eslint-config/          # 공유 ESLint 설정
├── tooling/
│   └── vitest/                 # 공유 Vitest 설정 (80% 커버리지)
├── turbo.json
├── pnpm-workspace.yaml         # catalog: 중앙집중 버전 관리
└── package.json
```

## 시작하기

### 요구 사항

- Node.js 20+
- pnpm 10+

### 설치

```bash
pnpm install
```

### 개발

```bash
pnpm dev
```

[http://localhost:3000](http://localhost:3000)에서 개발 서버가 실행됩니다.

### 빌드

```bash
pnpm build
```

### 테스트

```bash
# 전체 단위 테스트
pnpm test

# E2E 테스트 (apps/web)
pnpm --filter @playground/web test:e2e
```

### 코드 품질

```bash
# 타입 체크
pnpm typecheck

# 린트
pnpm lint

# 포맷
pnpm format
```

## 패키지

### `@playground/web`

Next.js 15 풀스택 앱. Record Candy의 메인 애플리케이션.

### `@playground/ui`

공유 React 컴포넌트 라이브러리.

| 컴포넌트 | 설명 |
|----------|------|
| `Button`, `Input`, `Card` | 기본 UI 컴포넌트 |
| `MovieTicketCard` | 영화 티켓 스텁 형태 카드 |
| `BookStackCard` | 책 스택 형태 세로 카드 |
| `RecordSpine` / `RecordSpineStack` | 파스텔 바 쌓기 시각화 |
| `TicketCollection` | 영화 티켓 더미 컨테이너 |
| `Bookshelf` | 나무 책장 컨테이너 |
| `RatingDisplay` | 캔디 아이콘 평점 표시 |
| `EmotionTag` | 감정 태그 칩 |
| `SearchResultCard` | 검색 결과 카드 |
| `FilterBar`, `SortSelect` | 필터/정렬 컨트롤 |
| `EmptyState`, `Modal` | 빈 상태, 모달 |

### `@playground/db`

Drizzle ORM + SQLite (better-sqlite3).

### `@playground/utils`

공유 유틸리티 + Record Candy 타입 및 헬퍼.

```ts
import type { Record, Movie, Book, WorkType, SortOption } from '@playground/utils'
import { filterRecords, sortRecords, formatRecordDate, generateId } from '@playground/utils'
```

## 버전 관리

모든 의존성 버전은 `pnpm-workspace.yaml`의 `catalog:` 프로토콜로 중앙 관리됩니다.
