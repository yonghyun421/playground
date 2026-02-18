import { create } from 'zustand'
import type { RecordFilter, SortOption } from '@playground/utils'

/** 필터/정렬 스토어 상태 및 액션 */
interface FilterStore {
  filter: RecordFilter
  sort: SortOption

  /** 필터 설정 (불변성 패턴) */
  setFilter: (filter: RecordFilter) => void

  /** 정렬 설정 */
  setSort: (sort: SortOption) => void

  /** 필터 및 정렬 초기화 */
  resetFilters: () => void
}

/** 기본 필터 상태 */
const DEFAULT_FILTER: RecordFilter = {}

/** 기본 정렬 옵션 */
const DEFAULT_SORT: SortOption = 'newest'

export const useFilterStore = create<FilterStore>((set) => ({
  filter: DEFAULT_FILTER,
  sort: DEFAULT_SORT,

  setFilter: (filter) => {
    // 불변성 패턴: 새 필터 객체로 교체
    set({ filter: { ...filter } })
  },

  setSort: (sort) => {
    set({ sort })
  },

  resetFilters: () => {
    set({ filter: DEFAULT_FILTER, sort: DEFAULT_SORT })
  },
}))
