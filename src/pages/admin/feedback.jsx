import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react'
import { Btn } from './ui'

const Ctx = createContext()

// إشعارات صغيرة (toast) ونافذة تأكيد، بدل alert و confirm العادية
export function FeedbackProvider({ children }) {
  const [toasts, setToasts] = useState([])
  const [dialog, setDialog] = useState(null)
  const idRef = useRef(0)

  const toast = useCallback((message, type = 'success') => {
    const id = ++idRef.current
    setToasts((l) => [...l, { id, message, type }])
    setTimeout(() => setToasts((l) => l.filter((x) => x.id !== id)), 3800)
  }, [])

  // بترجع Promise<boolean>
  const confirm = useCallback(
    ({ title, message, confirmLabel = 'تأكيد', danger = false }) =>
      new Promise((resolve) => setDialog({ title, message, confirmLabel, danger, resolve })),
    []
  )

  const close = (value) => {
    dialog?.resolve(value)
    setDialog(null)
  }

  useEffect(() => {
    if (!dialog) return
    const onKey = (e) => e.key === 'Escape' && close(false)
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  })

  const value = useMemo(() => ({ toast, confirm }), [toast, confirm])

  return (
    <Ctx.Provider value={value}>
      {children}

      <div className="fixed top-20 inset-x-0 z-[80] flex flex-col items-center gap-space-sm px-gutter pointer-events-none" role="status" aria-live="polite">
        {toasts.map((x) => (
          <div
            key={x.id}
            className={`pointer-events-auto max-w-[420px] w-full rounded-xl px-space-lg py-space-md shadow-lg text-label-lg flex items-center gap-2 ${
              x.type === 'error' ? 'bg-error-container text-on-error-container' : 'bg-inverse-surface text-inverse-on-surface'
            }`}
          >
            <span className="material-symbols-outlined text-[20px]">{x.type === 'error' ? 'error' : 'check_circle'}</span>
            {x.message}
          </div>
        ))}
      </div>

      {dialog && (
        <div className="fixed inset-0 z-[90] flex items-center justify-center bg-inverse-surface/50 px-gutter" onMouseDown={() => close(false)}>
          <div
            role="alertdialog"
            aria-modal="true"
            aria-label={dialog.title}
            onMouseDown={(e) => e.stopPropagation()}
            className="w-full max-w-[380px] bg-surface rounded-2xl shadow-xl p-space-xl flex flex-col gap-space-md"
          >
            <h2 className="text-title-sm font-bold">{dialog.title}</h2>
            {dialog.message && <p className="text-body-md text-on-surface-variant">{dialog.message}</p>}
            <div className="flex gap-space-sm pt-space-sm">
              <Btn variant={dialog.danger ? 'danger' : 'primary'} className="flex-1" onClick={() => close(true)}>
                {dialog.confirmLabel}
              </Btn>
              <Btn variant="soft" onClick={() => close(false)}>
                إلغاء
              </Btn>
            </div>
          </div>
        </div>
      )}
    </Ctx.Provider>
  )
}

export const useFeedback = () => useContext(Ctx)
