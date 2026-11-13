import { Link, useLocation } from 'react-router-dom'
import { useCart } from '../context/useCart'
import { useLang } from '../i18n/useLang'

// شريط عائم يظهر بصفحات التصفح لما يكون في أصناف بالسلة
export default function CartBar() {
  const { t } = useLang()
  const { count } = useCart()
  const { pathname } = useLocation()
  const browsing = pathname === '/' || pathname === '/menu' || pathname.startsWith('/menu/')
  if (!count || !browsing) return null

  return (
    <div className="fixed bottom-0 inset-x-0 z-40 pb-safe pointer-events-none">
      <div className="max-w-[480px] mx-auto p-space-md">
        <Link
          to="/cart"
          className="pointer-events-auto min-h-[52px] w-full rounded-full bg-primary text-on-primary shadow-lg px-space-xl flex items-center justify-between active:scale-[0.98] transition"
        >
          <span className="flex items-center gap-2 text-label-lg">
            <span className="material-symbols-outlined text-[22px]">shopping_basket</span>
            {t('viewCart')}
          </span>
          <span className="min-w-[28px] h-7 px-2 rounded-full bg-on-primary text-primary text-label-lg flex items-center justify-center">
            {count}
          </span>
        </Link>
      </div>
    </div>
  )
}
