import { formatPrice } from './format'

// أسطر السلة الصالحة فقط: الصنف موجود ومتوفر وكميته أكبر من صفر
export function buildRows(items, lines) {
  return items
    .filter((it) => it.available && Number(lines[it.id]) > 0)
    .map((it) => ({ item: it, qty: Number(lines[it.id]) }))
}

export const cartTotal = (rows) => rows.reduce((sum, r) => sum + r.item.price * r.qty, 0)

// نص رسالة واتساب للمطعم. t و tr جايين من LangContext
export function buildOrderMessage({ rows, name = '', note = '', lang, t, tr }) {
  const out = [t('waOrderTitle'), '']
  if (name.trim()) out.push(`${t('waName')}: ${name.trim()}`, '')
  rows.forEach((r) => out.push(`• ${r.qty} × ${tr(r.item, 'name')} = ${formatPrice(r.item.price * r.qty, lang)}`))
  out.push('', `${t('total')}: ${formatPrice(cartTotal(rows), lang)}`)
  if (note.trim()) out.push('', `${t('waNote')}: ${note.trim()}`)
  return out.join('\n')
}

export const whatsappUrl = (phone, text) =>
  `https://wa.me/${String(phone || '').replace(/\D/g, '')}?text=${encodeURIComponent(text)}`
