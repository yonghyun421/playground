import { nanoid } from 'nanoid'

/**
 * nanoid 기반 고유 ID 생성
 * @returns 21자리 URL 안전 문자열 ID
 */
export const generateId = (): string => nanoid()
