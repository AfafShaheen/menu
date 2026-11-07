import { useState } from 'react'
import { Link, NavLink, Outlet } from 'react-router-dom'
import { isLoggedIn, login, logout } from '../../data/auth'
import { useSettings } from '../../context/SettingsContext'
import { Btn, inputCls } from './ui'

const TABS = [
  { to: '/admin', label: 'الرئيسية', icon: 'dashboard', end: true },
  { to: '/admin/items', label: 'الأصناف', icon: 'lunch_dining' },
  { to: '/admin/categories', label: 'الأقسام', icon: 'category' },
  { to: '/admin/slides', label: 'السلايدر', icon: 'view_carousel' },
  { to: '/admin/settings', label: 'الإعدادات', icon: 'settings' },
]

function Login({ onDone }) {
  const [pw, setPw] = useState('')
  const [error, setError] = useState(false)
  const [busy, setBusy] = useState(false)

  const submit = async (e) => {
    e.preventDefault()
    setBusy(true)
    const ok = await login(pw)
    setBusy(false)
    if (ok) onDone()
    else setError(true)
  }

  return (
    <main className="min-h-screen flex items-center justify-center px-gutter bg-surface">
      <form onSubmit={submit} className="w-full max-w-[400px] flex flex-col items-center gap-space-lg">
        <span className="w-16 h-16 rounded-full bg-primary flex items-center justify-center shadow-md">
          <span className="material-symbols-outlined text-on-primary text-[32px]">lock</span>
        </span>
        <div className="text-center">
          <h1 className="text-headline-lg text-on-surface">لوحة التحكم</h1>
          <p className="text-body-sm text-on-surface-variant mt-1">أدخل كلمة المرور لإدارة القائمة</p>
        </div>

        <div className="w-full flex flex-col gap-space-xs">
          <input
            type="password"
            autoFocus
            dir="ltr"
            value={pw}
            onChange={(e) => {
              setPw(e.target.value)
              setError(false)
            }}
            placeholder="كلمة المرور"
            aria-label="كلمة المرور"
            className={`${inputCls} text-center ${error ? 'border-error ring-1 ring-error' : ''}`}
          />
          {error && <p className="text-label-md text-error text-center">كلمة المرور غير صحيحة</p>}
        </div>

        <Btn type="submit" className="w-full" icon="login" disabled={busy || !pw}>
          دخول
        </Btn>
        <Link to="/" className="text-label-lg text-on-surface-variant">
          العودة للموقع
        </Link>
      </form>
    </main>
  )
}

export default function AdminLayout() {
  const [authed, setAuthed] = useState(isLoggedIn())
  const { settings } = useSettings()

  if (!authed) return <Login onDone={() => setAuthed(true)} />

  return (
    <div dir="rtl" className="min-h-screen bg-surface pb-28">
      <header className="sticky top-0 z-40 bg-surface/90 backdrop-blur-xl shadow-[0_1px_8px_rgba(0,0,0,0.04)] pt-safe">
        <div className="h-16 px-gutter flex items-center justify-between max-w-[720px] mx-auto">
          <div className="flex items-center gap-space-sm">
            <span className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
              <span className="material-symbols-outlined text-on-primary text-[18px]">admin_panel_settings</span>
            </span>
            <div className="flex flex-col">
              <span className="text-title-sm font-bold text-primary leading-tight">{settings.nameAr || 'لوحة التحكم'}</span>
              <span className="text-label-md text-on-surface-variant">لوحة التحكم</span>
            </div>
          </div>
          <div className="flex items-center gap-space-xs">
            <Link
              to="/"
              className="min-h-[40px] px-space-md rounded-full bg-surface-container-high text-label-md flex items-center gap-1"
            >
              <span className="material-symbols-outlined text-[18px]">visibility</span>
              الموقع
            </Link>
            <button
              type="button"
              onClick={() => {
                logout()
                setAuthed(false)
              }}
              className="min-h-[40px] px-space-md rounded-full bg-error-container text-on-error-container text-label-md flex items-center gap-1"
            >
              <span className="material-symbols-outlined text-[18px]">logout</span>
              خروج
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-[720px] mx-auto px-gutter pt-space-lg">
        <Outlet />
      </main>

      <nav className="fixed bottom-0 inset-x-0 z-40 bg-surface/95 backdrop-blur-md border-t border-outline-variant pb-safe">
        <div className="max-w-[720px] mx-auto grid grid-cols-5">
          {TABS.map((tab) => (
            <NavLink
              key={tab.to}
              to={tab.to}
              end={tab.end}
              className={({ isActive }) =>
                `flex flex-col items-center gap-0.5 py-2 text-label-md transition-colors ${
                  isActive ? 'text-primary' : 'text-on-surface-variant'
                }`
              }
            >
              <span className="material-symbols-outlined text-[24px]">{tab.icon}</span>
              {tab.label}
            </NavLink>
          ))}
        </div>
      </nav>
    </div>
  )
}
