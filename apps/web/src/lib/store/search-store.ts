// 검색 관련 전역 상태 스토어 (작품 선택 상태 관리)
import { create } from 'zustand'
import type { Work, WorkType } from '@playground/utils'

/** 검색 스토어 상태 및 액션 */
interface SearchStore {
  /** 사용자가 선택한 작품 */
  selectedWork: Work | null

  /** 선택된 작품의 유형 */
  selectedWorkType: WorkType | null

  /** 작품 선택 (기록 작성 모달에서 사용) */
  selectWork: (work: Work, workType: WorkType) => void

  /** 선택 초기화 */
  clearSelectedWork: () => void
}

export const useSearchStore = create<SearchStore>()((set) => ({
  selectedWork: null,
  selectedWorkType: null,

  selectWork: (work, workType) => {
    // 불변성 패턴: 새 객체로 상태 업데이트
    set({ selectedWork: work, selectedWorkType: workType })
  },

  clearSelectedWork: () => {
    set({ selectedWork: null, selectedWorkType: null })
  },
}))
