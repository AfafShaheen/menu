import { createContext, useContext, useEffect, useState } from 'react'
import ar from './ar.json'
import en from './en.json'

const dict = { ar, en }
const LangContext = createContext()

export function LangProvider({ children }) {
  const [lang, setLang] = useState(() => {
    try { return localStorage.getItem('menuDemo:lang') || 'ar' } catch { return 'ar' }
  })

  useEffect(() => {
    document.documentElement.lang = lang
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr'
    try { localStorage.setItem('menuDemo:lang', lang) } catch {}
  }, [lang])

  const t = (key) => dict[lang][key] ?? key

  // بتختار الحقل حسب اللغة (nameAr / nameEn) وبترجع للتانية إذا فاضي
  const tr = (obj, field) => {
    if (!obj) return ''
    const main = lang === 'ar' ? 'Ar' : 'En'
    const other = lang === 'ar' ? 'En' : 'Ar'
    return obj[field + main] || obj[field + other] || ''
  }

  const toggle = () => setLang((l) => (l === 'ar' ? 'en' : 'ar'))

  return (
    <LangContext.Provider value={{ lang, t, tr, toggle }}>
      {children}
    </LangContext.Provider>
  )
}

export const useLang = () => useContext(LangContext)