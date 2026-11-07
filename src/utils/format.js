export const formatNumber = (n) => Number(n).toLocaleString('en-US')
export const currency = (lang) => (lang === 'ar' ? 'ل.س' : 'SYP')
export const formatPrice = (n, lang) => `${formatNumber(n)} ${currency(lang)}`
export const formatPhone = (p = '') =>
  String(p).replace(/\D/g, '').replace(/^(\d{4})(\d{3})(\d{3})$/, '$1 $2 $3')

export const countLabel = (n, lang) => {
  if (lang === 'ar') {
    if (n === 1) return 'صنف واحد'
    if (n === 2) return 'صنفان'
    return n >= 3 && n <= 10 ? `${n} أصناف` : `${n} صنف`
  }
  return n === 1 ? '1 item' : `${n} items`
}