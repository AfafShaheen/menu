import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useLang } from '../i18n/useLang'
import { useSettings } from '../context/useSettings'
import { useCart } from '../context/useCart'

export default function Header() {
  const { lang, t, tr, toggle } = useLang()
  const { settings } = useSettings()
  const { pathname } = useLocation()

  const navigate = useNavigate()
  const { count } = useCart()

  if (pathname.startsWith('/admin')) return null // للأدمن هيدر خاص

  const isHome = pathname === '/'
  const isItem = pathname.startsWith('/item/') || pathname === '/cart'
  const backTo = pathname.startsWith('/menu/') ? '/menu' : '/'
  // من صفحة الصنف نرجع للصفحة السابقة (قسم أو رئيسية)، وإذا انفتحت مباشرة نروح للقائمة
  const goBack = (e) => {
    if (!isItem) return
    e.preventDefault()
    if (window.history.length > 1) navigate(-1)
    else navigate('/menu')
  }

  return (
    <header className="fixed top-0 inset-x-0 z-50 bg-surface/90 backdrop-blur-xl shadow-[0_1px_8px_rgba(0,0,0,0.04)] pt-safe">
      <div className="h-16 px-gutter flex items-center justify-between max-w-[480px] mx-auto">
        <div className="flex items-center gap-space-xs">
          {!isHome && (
            <Link
              to={backTo}
              onClick={goBack}
              aria-label={t('back')}
              className="w-11 h-11 rounded-full flex items-center justify-center text-on-surface hover:bg-surface-container active:scale-95 transition-all"
            >
              <span className="material-symbols-outlined text-[24px]">
                {lang === 'ar' ? 'arrow_forward' : 'arrow_back'}
              </span>
            </Link>
          )}
          <Link to="/" className="flex items-center gap-space-sm">
            {settings.logo ? (
              <img src={settings.logo} alt="" className="h-8 w-auto object-contain" />
            ) : (
              <span className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
                <span className="material-symbols-outlined text-on-primary text-[18px]">restaurant</span>
              </span>
            )}
            <div className="flex flex-col">
              <span className="text-headline-md font-bold text-primary leading-tight">{tr(settings, 'name')}</span>
              <span className="text-label-md text-on-surface-variant font-medium">{t('headerSub')}</span>
            </div>
          </Link>
        </div>

        <div className="flex items-center gap-space-xs">
          <Link
            to="/cart"
            aria-label={t('cart')}
            className="relative w-11 h-11 rounded-full flex items-center justify-center text-on-surface hover:bg-surface-container active:scale-95 transition-all"
          >
            <span className="material-symbols-outlined text-[24px]">shopping_basket</span>
            {count > 0 && (
              <span className="absolute top-0.5 end-0.5 min-w-[18px] h-[18px] px-1 rounded-full bg-primary text-on-primary text-[11px] font-bold flex items-center justify-center">
                {count}
              </span>
            )}
          </Link>
          <button
            type="button"
            onClick={toggle}
            className="min-h-[44px] px-space-md py-space-xs rounded-full bg-surface-container-high text-on-surface text-label-md hover:bg-surface-variant transition-colors flex items-center justify-center gap-1"
          >
            <span className="material-symbols-outlined text-[18px]">translate</span>
            {t('switchLang')}
          </button>
        </div>
      </div>
    </header>
  )
}