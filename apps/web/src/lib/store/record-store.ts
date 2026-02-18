import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Record } from '@playground/utils'

/** 감상 기록 생성 시 필요한 데이터 (id, createdAt, updatedAt 제외) */
type CreateRecordInput = Omit<Record, 'id' | 'createdAt' | 'updatedAt'>

/** 감상 기록 수정 시 사용하는 부분 업데이트 타입 */
type UpdateRecordInput = Partial<
  Omit<Record, 'id' | 'createdAt' | 'updatedAt'>
>

/** 감상 기록 스토어 상태 및 액션 */
interface RecordStore {
  records: Record[]

  /** 새 감상 기록 추가 */
  addRecord: (input: CreateRecordInput & { id: string }) => void

  /** 기존 기록 수정 (불변성 패턴) */
  updateRecord: (id: string, updates: UpdateRecordInput) => void

  /** 기록 삭제 */
  deleteRecord: (id: string) => void

  /** ID로 기록 단건 조회 */
  getRecordById: (id: string) => Record | undefined

  /** 전체 기록 조회 */
  getAllRecords: () => Record[]
}

export const useRecordStore = create<RecordStore>()(
  persist(
    (set, get) => ({
      records: [],

      addRecord: (input) => {
        const now = new Date().toISOString()
        const newRecord: Record = {
          ...input,
          createdAt: now,
          updatedAt: now,
        }
        // 불변성 패턴: 기존 배열을 변경하지 않고 새 배열 생성
        set((state) => ({ records: [...state.records, newRecord] }))
      },

      updateRecord: (id, updates) => {
        set((state) => ({
          records: state.records.map((record) =>
            record.id === id
              ? { ...record, ...updates, updatedAt: new Date().toISOString() }
              : record
          ),
        }))
      },

      deleteRecord: (id) => {
        set((state) => ({
          records: state.records.filter((record) => record.id !== id),
        }))
      },

      getRecordById: (id) => {
        return get().records.find((record) => record.id === id)
      },

      getAllRecords: () => {
        return get().records
      },
    }),
    {
      // localStorage 영속화 키
      name: 'record-candy-records',
    }
  )
)
