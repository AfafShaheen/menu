import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { useLang } from '../i18n/useLang'
import { useSettings } from '../context/useSettings'
import { useCart } from '../context/useCart'
import { useData } from '../hooks/useData'
import { getItems } from '../data/dataService'
import { formatPrice } from '../utils/format'
import { buildRows, cartTotal, buildOrderMessage, whatsappUrl } from '../utils/cart'
import Img from '../components/Img'

const inputCls =
  'w-full rounded-lg border border-outline-variant bg-surface-container-lowest px-space-md py-2 text-body-md text-on-surface placeholder:text-outline focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary'

export default function Cart() {
  const { lang, t, tr } = useLang()
  const { settings } = useSettings()
  const { lines, setQty, remove, clear } = useCart()
  const { data: all, loading } = useData(() => getItems(), [], [])
  const [name, setName] = useState('')
  const [note, setNote] = useState('')

  const rows = useMemo(() => buildRows(all, lines), [all, lines])
  const total = cartTotal(rows)
  const phone = String(settings.whatsapp || '').replace(/\D/g, '')

  // أصناف انحذفت أو صارت غير متوفرة بعد ما انضافت للسلة بتنشال تلقائياً
  const staleKey = loading ? '' : Object.keys(lines).filter((id) => !rows.some((r) => r.item.id === id)).join(',')
  useEffect(() => {
    if (staleKey) staleKey.split(',').forEach(remove)
  }, [staleKey, remove])

  const send = () => {
    const text = buildOrderMessage({ rows, name, note, lang, t, tr })
    window.open(whatsappUrl(phone, text), '_blank', 'noopener')
  }

  if (!loading && rows.length === 0) {
    return (
      <main className="w-full max-w-[480px] mx-auto pt-[calc(4rem+env(safe-area-inset-top,0px))] px-space-md">
        <div className="flex flex-col items-center text-center gap-space-md py-24">
          <span className="w-20 h-20 rounded-full bg-surface-container flex items-center justify-center text-on-surface-variant">
            <span className="material-symbols-outlined text-[40px]">shopping_basket</span>
          </span>
          <h1 className="text-headline-md">{t('cartEmpty')}</h1>
          <p className="text-body-md text-on-surface-variant">{t('cartEmptyHint')}</p>
          <Link to="/menu" className="min-h-[48px] px-space-xl rounded-full bg-primary text-on-primary text-label-lg flex items-center">
            {t('browseMenuBtn')}
          </Link>
        </div>
      </main>
    )
  }

  return (
    <main className="w-full max-w-[480px] mx-auto pt-[calc(4rem+env(safe-area-inset-top,0px))] pb-44">
      <div className="px-space-md pt-space-md pb-space-sm flex items-center justify-between">
        <div className="flex items-center gap-space-xs">
          <span className="w-2 h-6 bg-primary rounded-full"></span>
          <h1 className="text-headline-lg">{t('cartTitle')}</h1>
        </div>
        <button
          type="button"
          onClick={() => window.confirm(t('clearConfirm')) && clear()}
          className="text-label-lg text-error min-h-[44px] px-space-sm"
        >
          {t('clearCart')}
        </button>
      </div>

      <ul className="flex flex-col gap-space-md px-space-md">
        {rows.map(({ item, qty }) => (
          <li key={item.id} className="bg-surface-container-lowest rounded-xl shadow-sm p-space-md flex gap-space-md">
            <Link to={`/item/${item.id}`} className="w-20 h-20 rounded-lg overflow-hidden shrink-0 bg-surface-container">
              <Img src={item.image} alt={tr(item, 'name')} className="w-full h-full" />
            </Link>
            <div className="flex-1 min-w-0 flex flex-col justify-between">
              <div className="flex items-start justify-between gap-space-sm">
                <h2 className="text-title-sm font-bold line-clamp-2">{tr(item, 'name')}</h2>
                <button
                  type="button"
                  aria-label={t('remove')}
                  onClick={() => remove(item.id)}
                  className="w-8 h-8 -m-1 rounded-full flex items-center justify-center text-on-surface-variant hover:bg-surface-container"
                >
                  <span className="material-symbols-outlined text-[20px]">close</span>
                </button>
              </div>
              <div className="flex items-center justify-between pt-space-xs">
                <span className="text-price-tag text-primary">{formatPrice(item.price * qty, lang)}</span>
                <div className="flex items-center gap-1 bg-surface-container rounded-full">
                  <button
                    type="button"
                    aria-label="-"
                    onClick={() => setQty(item.id, qty - 1)}
                    className="w-9 h-9 rounded-full flex items-center justify-center active:scale-90"
                  >
                    <span className="material-symbols-outlined text-[20px]">remove</span>
                  </button>
                  <span className="min-w-[24px] text-center text-label-lg">{qty}</span>
                  <button
                    type="button"
                    aria-label="+"
                    onClick={() => setQty(item.id, qty + 1)}
                    className="w-9 h-9 rounded-full flex items-center justify-center active:scale-90"
                  >
                    <span className="material-symbols-outlined text-[20px]">add</span>
                  </button>
                </div>
              </div>
            </div>
          </li>
        ))}
      </ul>

      <section className="px-space-md pt-space-lg flex flex-col gap-space-md">
        <label className="flex flex-col gap-1">
          <span className="text-label-lg">{t('customerName')}</span>
          <input value={name} onChange={(e) => setName(e.target.value)} className={inputCls} />
        </label>
        <label className="flex flex-col gap-1">
          <span className="text-label-lg">{t('orderNote')}</span>
          <textarea rows={3} value={note} onChange={(e) => setNote(e.target.value)} className={inputCls} />
        </label>
      </section>

      <div className="fixed bottom-0 inset-x-0 z-40 bg-surface/95 backdrop-blur-md border-t border-outline-variant pb-safe">
        <div className="max-w-[480px] mx-auto p-space-md flex flex-col gap-space-sm">
          <div className="flex items-center justify-between px-space-xs">
            <span className="text-body-md text-on-surface-variant">{t('total')}</span>
            <span className="text-headline-md text-primary font-bold">{formatPrice(total, lang)}</span>
          </div>
          {phone ? (
            <button
              type="button"
              onClick={send}
              className="min-h-[52px] w-full rounded-full bg-green-600 text-white text-label-lg flex items-center justify-center gap-2 active:scale-[0.98] transition"
            >
              <span className="material-symbols-outlined text-[22px]">send</span>
              {t('sendWhatsapp')}
            </button>
          ) : (
            <p className="text-center text-body-sm text-error">{t('noWhatsapp')}</p>
          )}
          <p className="text-center text-label-md text-on-surface-variant">{t('sendHint')}</p>
        </div>
      </div>
    </main>
  )
}
