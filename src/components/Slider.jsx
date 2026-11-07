import { useEffect, useState } from 'react'
import { useLang } from '../i18n/LangContext'
import Img from './Img'

export const BADGE = {
  primary: 'bg-primary text-on-primary',
  secondary: 'bg-secondary text-on-secondary',
  tertiary: 'bg-tertiary-container text-on-tertiary',
}

export default function Slider({ slides }) {
  const { lang, tr } = useLang()
  const [i, setI] = useState(0)
  const [paused, setPaused] = useState(false)
  const n = slides.length
  // بالعربي الشريحة التالية على اليسار، فالحركة بالاتجاه المعاكس للإنجليزي
  const dir = lang === 'ar' ? 1 : -1

  useEffect(() => {
    if (paused || n < 2) return
    const id = setInterval(() => setI((x) => (x + 1) % n), 4500)
    return () => clearInterval(id)
  }, [paused, n])

  if (!n) return null

  return (
    <div
      className="relative w-full overflow-hidden rounded-xl shadow-md bg-surface-container-low"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onTouchStart={() => setPaused(true)}
      onTouchEnd={() => setPaused(false)}
    >
      <div
        className="flex transition-transform duration-500 ease-out w-full"
        style={{ transform: `translateX(${dir * i * 100}%)` }}
      >
        {slides.map((s) => {
          const badge = tr(s, 'badge')
          const title = tr(s, 'title')
          const subtitle = tr(s, 'subtitle')
          return (
            <div key={s.id} className="w-full shrink-0 relative h-64 overflow-hidden rounded-xl">
              <Img src={s.image} className="w-full h-full" />
              {(badge || title || subtitle) && (
                <div className="absolute inset-0 bg-gradient-to-t from-inverse-surface/90 via-inverse-surface/40 to-transparent flex flex-col justify-end p-space-lg text-on-primary">
                  {badge && (
                    <span className={`inline-flex self-start ${BADGE[s.badgeColor] || BADGE.primary} text-label-md px-3 py-1 rounded-full mb-space-xs shadow-sm`}>
                      {badge}
                    </span>
                  )}
                  {title && <h2 className="text-headline-md font-bold leading-snug">{title}</h2>}
                  {subtitle && <p className="text-body-sm text-surface-container-highest mt-1">{subtitle}</p>}
                </div>
              )}
            </div>
          )
        })}
      </div>

      {n > 1 && (
        <div className="absolute bottom-3 inset-x-0 flex items-center justify-center gap-1.5 z-10">
          {slides.map((s, idx) => (
            <button
              key={s.id}
              type="button"
              aria-label={String(idx + 1)}
              onClick={() => setI(idx)}
              className={`h-2 rounded-full transition-all duration-300 ${idx === i ? 'w-6 bg-primary' : 'w-2 bg-surface/70'}`}
            />
          ))}
        </div>
      )}
    </div>
  )
}