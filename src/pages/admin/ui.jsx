import { useEffect } from 'react'

export const inputCls =
  'w-full rounded-lg border border-outline-variant bg-surface-container-lowest px-space-md py-2 text-body-md text-on-surface placeholder:text-outline focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary'

export function Field({ label, hint, children }) {
  return (
    <label className="flex flex-col gap-1">
      {label && <span className="text-label-lg text-on-surface">{label}</span>}
      {children}
      {hint && <span className="text-label-md text-on-surface-variant font-normal">{hint}</span>}
    </label>
  )
}

export function TextField({ label, hint, value, onChange, textarea, rows = 3, dir, ...rest }) {
  const Tag = textarea ? 'textarea' : 'input'
  return (
    <Field label={label} hint={hint}>
      <Tag
        {...rest}
        dir={dir}
        rows={textarea ? rows : undefined}
        value={value ?? ''}
        onChange={(e) => onChange(e.target.value)}
        className={inputCls}
      />
    </Field>
  )
}

export function SelectField({ label, value, onChange, options }) {
  return (
    <Field label={label}>
      <select value={value ?? ''} onChange={(e) => onChange(e.target.value)} className={inputCls}>
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </Field>
  )
}

export function Toggle({ checked, onChange, label }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={() => onChange(!checked)}
      className={`relative w-11 h-6 rounded-full shrink-0 transition-colors ${checked ? 'bg-green-600' : 'bg-outline-variant'}`}
    >
      <span
        className={`absolute top-0.5 start-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform ${
          checked ? 'ltr:translate-x-5 rtl:-translate-x-5' : ''
        }`}
      />
    </button>
  )
}

export function Btn({ variant = 'primary', icon, children, className = '', ...rest }) {
  const styles = {
    primary: 'bg-primary text-on-primary hover:opacity-90',
    soft: 'bg-surface-container-high text-on-surface hover:bg-surface-variant',
    danger: 'bg-error-container text-on-error-container hover:opacity-90',
  }
  return (
    <button
      type="button"
      {...rest}
      className={`min-h-[44px] px-space-xl rounded-full text-label-lg inline-flex items-center justify-center gap-1.5 active:scale-95 transition disabled:opacity-50 ${styles[variant]} ${className}`}
    >
      {icon && <span className="material-symbols-outlined text-[18px]">{icon}</span>}
      {children}
    </button>
  )
}

export function IconBtn({ icon, label, onClick, disabled, tone = '' }) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      onClick={onClick}
      disabled={disabled}
      className={`w-10 h-10 rounded-full flex items-center justify-center hover:bg-surface-container active:scale-95 transition disabled:opacity-30 ${tone || 'text-on-surface-variant'}`}
    >
      <span className="material-symbols-outlined text-[20px]">{icon}</span>
    </button>
  )
}

// نافذة منبثقة تظهر كورقة من تحت على الموبايل
export function Modal({ title, onClose, onSave, saving, children }) {
  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && onClose()
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [onClose])

  return (
    <div className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center bg-inverse-surface/50" onMouseDown={onClose}>
      <div
        role="dialog"
        aria-modal="true"
        onMouseDown={(e) => e.stopPropagation()}
        className="w-full max-w-[480px] max-h-[92vh] flex flex-col bg-surface rounded-t-2xl sm:rounded-2xl shadow-xl"
      >
        <div className="flex items-center justify-between px-space-lg py-space-md border-b border-outline-variant">
          <h2 className="text-title-sm font-bold">{title}</h2>
          <IconBtn icon="close" label="إغلاق" onClick={onClose} />
        </div>
        <div className="flex-1 overflow-y-auto px-space-lg py-space-lg flex flex-col gap-space-lg">{children}</div>
        <div className="flex gap-space-sm px-space-lg py-space-md border-t border-outline-variant pb-safe">
          <Btn className="flex-1" icon="check" onClick={onSave} disabled={saving}>
            {saving ? 'جارٍ الحفظ...' : 'حفظ'}
          </Btn>
          <Btn variant="soft" onClick={onClose}>
            إلغاء
          </Btn>
        </div>
      </div>
    </div>
  )
}

export function PageTitle({ title, sub, action }) {
  return (
    <div className="flex items-start justify-between gap-space-md pb-space-md">
      <div>
        <h1 className="text-headline-lg text-on-surface">{title}</h1>
        {sub && <p className="text-body-sm text-on-surface-variant mt-0.5">{sub}</p>}
      </div>
      {action}
    </div>
  )
}

