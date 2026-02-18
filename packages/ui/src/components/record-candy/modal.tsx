'use client'

// Modal 컴포넌트 - Dialog 기반 래퍼 (framer-motion 애니메이션 적용)
import { useEffect, useRef, type ReactNode, type KeyboardEvent } from 'react'
import { createPortal } from 'react-dom'
import { motion, AnimatePresence } from 'framer-motion'

interface ModalProps {
  /** 모달 열림 여부 */
  open: boolean
  /** 모달 닫기 핸들러 */
  onClose: () => void
  /** 모달 제목 */
  title?: string
  /** 모달 설명 */
  description?: string
  /** 모달 내용 */
  children: ReactNode
  /** ESC 키로 닫기 허용 여부 (기본: true) */
  closeOnEsc?: boolean
  /** 오버레이 클릭으로 닫기 허용 여부 (기본: true) */
  closeOnOverlayClick?: boolean
  /** 최대 너비 클래스 */
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl'
}

/** 최대 너비 매핑 */
const maxWidthClasses = {
  sm: 'max-w-sm',
  md: 'max-w-md',
  lg: 'max-w-lg',
  xl: 'max-w-xl',
}

/**
 * Modal 컴포넌트
 * framer-motion 애니메이션을 적용한 접근성 지원 다이얼로그
 */
export function Modal({
  open,
  onClose,
  title,
  description,
  children,
  closeOnEsc = true,
  closeOnOverlayClick = true,
  maxWidth = 'md',
}: ModalProps) {
  const dialogRef = useRef<HTMLDivElement>(null)
  const titleId = 'modal-title'
  const descriptionId = description ? 'modal-desc' : undefined

  // ESC 키 핸들러
  useEffect(() => {
    if (!closeOnEsc) return

    const handleKeyDown = (e: globalThis.KeyboardEvent) => {
      if (e.key === 'Escape' && open) {
        onClose()
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [open, onClose, closeOnEsc])

  // 모달 열릴 때 body 스크롤 방지
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  // 모달 열릴 때 포커스 이동
  useEffect(() => {
    if (open && dialogRef.current) {
      dialogRef.current.focus()
    }
  }, [open])

  // 키보드 트랩 (Tab 키 처리)
  const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key !== 'Tab' || !dialogRef.current) return

    const focusable = dialogRef.current.querySelectorAll<HTMLElement>(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    )
    const firstEl = focusable[0]
    const lastEl = focusable[focusable.length - 1]

    if (e.shiftKey) {
      if (document.activeElement === firstEl) {
        e.preventDefault()
        lastEl?.focus()
      }
    } else {
      if (document.activeElement === lastEl) {
        e.preventDefault()
        firstEl?.focus()
      }
    }
  }

  if (typeof window === 'undefined') return null

  return createPortal(
    <AnimatePresence>
      {open && (
        /* 전체 화면 컨테이너 (배경 + 중앙 정렬) */
        <div className="fixed inset-0 z-50">
          {/* 배경 오버레이 (클릭 닫기용, aria-hidden 처리) */}
          <motion.div
            className="absolute inset-0"
            style={{ backgroundColor: 'rgba(0, 0, 0, 0.4)' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={closeOnOverlayClick ? onClose : undefined}
            aria-hidden="true"
          />

          {/* 다이얼로그 중앙 정렬 컨테이너 */}
          <div className="flex min-h-full items-center justify-center p-4">
            {/* 모달 패널 */}
            <motion.div
              ref={dialogRef}
              role="dialog"
              aria-modal="true"
              aria-labelledby={title ? titleId : undefined}
              aria-describedby={descriptionId}
              tabIndex={-1}
              onKeyDown={handleKeyDown}
              initial={{ opacity: 0, scale: 0.95, y: -10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -10 }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
              className={[
                'relative w-full',
                maxWidthClasses[maxWidth],
                'rounded-2xl bg-card p-6',
                'shadow-lg border border-border',
                'focus:outline-none',
              ].join(' ')}
            >
              {/* 닫기 버튼 */}
              <button
                type="button"
                onClick={onClose}
                className={[
                  'absolute right-4 top-4',
                  'flex h-8 w-8 items-center justify-center rounded-full',
                  'text-muted-foreground hover:bg-muted hover:text-foreground',
                  'transition-colors duration-150',
                  'focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
                ].join(' ')}
                aria-label="모달 닫기"
              >
                <svg
                  className="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>

              {/* 헤더 */}
              {(title || description) && (
                <div className="mb-4 pr-8">
                  {title && (
                    <h2
                      id={titleId}
                      className="text-lg font-semibold text-card-foreground"
                    >
                      {title}
                    </h2>
                  )}
                  {description && (
                    <p
                      id={descriptionId}
                      className="mt-1 text-sm text-muted-foreground"
                    >
                      {description}
                    </p>
                  )}
                </div>
              )}

              {/* 내용 */}
              <div>{children}</div>
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>,
    document.body
  )
}
