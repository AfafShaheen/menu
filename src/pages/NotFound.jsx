import { Link } from 'react-router-dom'
import { useLang } from '../i18n/useLang'

export default function NotFound() {
  const { t } = useLang()
  return (
    <main className="w-full max-w-[480px] mx-auto pt-[calc(4rem+env(safe-area-inset-top,0px))] px-space-md">
      <div className="flex flex-col items-center text-center gap-space-md py-24">
        <span className="w-20 h-20 rounded-full bg-surface-container flex items-center justify-center text-on-surface-variant">
          <span className="material-symbols-outlined text-[40px]">search_off</span>
        </span>
        <h1 className="text-headline-md">{t('notFound')}</h1>
        <p className="text-body-md text-on-surface-variant">{t('notFoundHint')}</p>
        <Link to="/" className="min-h-[48px] px-space-xl rounded-full bg-primary text-on-primary text-label-lg flex items-center">
          {t('goHome')}
        </Link>
      </div>
    </main>
  )
}
