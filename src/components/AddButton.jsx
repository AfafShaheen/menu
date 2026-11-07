import { useCart } from '../context/CartContext'
import { useLang } from '../i18n/LangContext'

// زر + صغير داخل البطاقات اللي هي روابط، فلازم نمنع فتح صفحة الصنف عند الضغط عليه
export default function AddButton({ item }) {
  const { t } = useLang()
  const { lines, add } = useCart()
  if (!item.available) return null
  const qty = lines[item.id] || 0

  return (
    <button
      type="button"
      aria-label={t('addToCart')}
      onClick={(e) => {
        e.preventDefault()
        e.stopPropagation()
        add(item.id)
      }}
      className="relative w-10 h-10 shrink-0 rounded-full bg-primary text-on-primary flex items-center justify-center shadow-sm active:scale-90 transition"
    >
      <span className="material-symbols-outlined text-[22px]">add</span>
      {qty > 0 && (
        <span className="absolute -top-1 -end-1 min-w-[20px] h-5 px-1 rounded-full bg-inverse-surface text-on-primary text-label-md flex items-center justify-center">
          {qty}
        </span>
      )}
    </button>
  )
}
