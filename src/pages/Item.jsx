import { useEffect } from 'react'
import { Link, Navigate, useParams } from 'react-router-dom'
import { useLang } from '../i18n/LangContext'
import { useCart } from '../context/CartContext'
import { useData } from '../hooks/useData'
import { getCategories, getItem, getItems } from '../data/dataService'
import { formatPrice } from '../utils/format'
import { BADGE } from '../components/Slider'
import FeaturedCard from '../components/FeaturedCard'
import Img from '../components/Img'

export default function Item() {
  const { id } = useParams()
  const { lang, t, tr } = useLang()
  const { lines, add, setQty } = useCart()
  const { data: item, loading } = useData(() => getItem(id), [id], null)
  const { data: cats } = useData(getCategories, [], [])
  const { data: siblings } = useData(
    () => (item ? getItems({ categoryId: item.categoryId }) : Promise.resolve([])),
    [item?.categoryId],
    []
  )

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [id])

  if (!loading && !item) return <Navigate to="/menu" replace />
  if (!item) return null

  const cat = cats.find((c) => c.id === item.categoryId)
  const more = siblings.filter((s) => s.id !== item.id)
  const badge = tr(item, 'badge')
  const note = tr(item, 'note')
  const off = !item.available

  const qty = lines[item.id] || 0

  return (
    <main className="w-full max-w-[480px] mx-auto pt-[calc(4rem+env(safe-area-inset-top,0px))] pb-32">
      <div className="relative h-72 w-full overflow-hidden">
        <Img src={item.image} alt={tr(item, 'name')} className={`w-full h-full ${off ? 'grayscale opacity-60' : ''}`} />
        {off ? (
          <span className="absolute top-3 start-3 bg-inverse-surface text-on-primary text-label-md px-3 py-1 rounded-full shadow-sm">
            {t('unavailableNow')}
          </span>
        ) : (
          badge && (
            <span className={`absolute top-3 start-3 ${BADGE[item.badgeColor] || BADGE.primary} text-label-md px-3 py-1 rounded-full shadow-sm`}>
              {badge}
            </span>
          )
        )}
      </div>

      <div className="-mt-6 relative bg-surface rounded-t-2xl px-space-md pt-space-xl flex flex-col gap-space-md">
        {cat && (
          <Link
            to={`/menu/${cat.id}`}
            className="self-start inline-flex items-center gap-1 px-space-md py-1 rounded-full bg-surface-container text-on-surface-variant text-label-md"
          >
            <span className="material-symbols-outlined text-[14px]">{cat.icon || 'restaurant_menu'}</span>
            {tr(cat, 'name')}
          </Link>
        )}

        <div className="flex items-start justify-between gap-space-md">
          <h1 className="text-headline-lg text-on-surface flex-1">{tr(item, 'name')}</h1>
          <span className={`text-headline-md font-bold whitespace-nowrap ${off ? 'text-on-surface-variant' : 'text-primary'}`}>
            {formatPrice(item.price, lang)}
          </span>
        </div>

        <div className="flex items-center gap-space-sm flex-wrap">
          <span
            className={`inline-flex items-center gap-1 px-space-md py-1 rounded-full text-label-md ${
              off ? 'bg-error-container text-on-error-container' : 'bg-green-100 text-green-800'
            }`}
          >
            <span className="material-symbols-outlined text-[14px]">{off ? 'block' : 'check_circle'}</span>
            {off ? t('unavailableNow') : t('availableToday')}
          </span>
          {note && (
            <span className="inline-flex items-center gap-1 px-space-md py-1 rounded-full bg-surface-container text-on-surface-variant text-label-md">
              <span className="material-symbols-outlined text-[14px]">restaurant</span>
              {note}
            </span>
          )}
        </div>

        {tr(item, 'desc') && <p className="text-body-md text-on-surface-variant leading-relaxed">{tr(item, 'desc')}</p>}

        {off && (
          <div className="rounded-xl bg-surface-container-low p-space-md flex items-center gap-space-md">
            <span className="material-symbols-outlined text-on-surface-variant">info</span>
            <p className="text-body-sm text-on-surface-variant">{t('unavailableHint')}</p>
          </div>
        )}
      </div>

      {more.length > 0 && (
        <section className="pt-space-xl">
          <div className="px-space-md pb-space-sm flex items-center gap-space-xs">
            <span className="w-2 h-6 bg-primary rounded-full"></span>
            <h2 className="text-headline-md text-on-surface">{t('moreFromCategory')}</h2>
          </div>
          <div className="no-scrollbar flex gap-space-md overflow-x-auto snap-x px-space-md pb-space-sm">
            {more.map((it) => (
              <FeaturedCard key={it.id} item={it} />
            ))}
          </div>
        </section>
      )}

      <div className="fixed bottom-0 inset-x-0 z-40 bg-surface/95 backdrop-blur-md border-t border-outline-variant pb-safe">
        <div className="max-w-[480px] mx-auto p-space-md">
          {!off && qty === 0 && (
            <button
              type="button"
              onClick={() => add(item.id)}
              className="min-h-[48px] w-full rounded-full bg-primary text-on-primary text-label-lg flex items-center justify-center gap-2 active:scale-[0.98] transition"
            >
              <span className="material-symbols-outlined text-[20px]">add_shopping_cart</span>
              {t('addToCart')} · {formatPrice(item.price, lang)}
            </button>
          )}
          {!off && qty > 0 && (
            <div className="flex items-center gap-space-md">
              <div className="flex items-center gap-1 bg-surface-container rounded-full">
                <button
                  type="button"
                  aria-label="-"
                  onClick={() => setQty(item.id, qty - 1)}
                  className="w-11 h-11 rounded-full flex items-center justify-center active:scale-90"
                >
                  <span className="material-symbols-outlined">remove</span>
                </button>
                <span className="min-w-[28px] text-center text-title-sm">{qty}</span>
                <button
                  type="button"
                  aria-label="+"
                  onClick={() => setQty(item.id, qty + 1)}
                  className="w-11 h-11 rounded-full flex items-center justify-center active:scale-90"
                >
                  <span className="material-symbols-outlined">add</span>
                </button>
              </div>
              <Link
                to="/cart"
                className="min-h-[48px] flex-1 rounded-full bg-primary text-on-primary text-label-lg flex items-center justify-center gap-2"
              >
                <span className="material-symbols-outlined text-[20px]">shopping_basket</span>
                {t('viewCart')}
              </Link>
            </div>
          )}
          {off && (
            <Link
              to={cat ? `/menu/${cat.id}` : '/menu'}
              className="min-h-[48px] w-full rounded-full bg-surface-container-high text-on-surface text-label-lg flex items-center justify-center gap-2"
            >
              {t('backToCategory')}
            </Link>
          )}
        </div>
      </div>
    </main>
  )
}
