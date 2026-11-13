// بحث بالقائمة: بيتجاهل التشكيل واختلاف الهمزات والتاء المربوطة، وبيدعم أكثر من كلمة.

export function normalize(text = '') {
  return String(text)
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[ً-ٰٟـ]/g, '') // تشكيل وتطويل
    .replace(/[أإآٱ]/g, 'ا')
    .replace(/ى/g, 'ي')
    .replace(/ة/g, 'ه')
    .replace(/ؤ/g, 'و')
    .replace(/ئ/g, 'ي')
    .replace(/[̀-ͯ]/g, '') // علامات لاتينية (é → e)
    .replace(/\s+/g, ' ')
    .trim()
}

export const tokens = (q) => normalize(q).split(' ').filter(Boolean)

// الاسم أهم من الوصف، والوصف أهم من اسم القسم
export function searchItems(items, query, categories = []) {
  const words = tokens(query)
  if (!words.length) return []
  const catName = Object.fromEntries(
    categories.map((c) => [c.id, normalize(`${c.nameAr || ''} ${c.nameEn || ''}`)])
  )

  const scored = []
  for (const it of items) {
    const name = normalize(`${it.nameAr || ''} ${it.nameEn || ''}`)
    const desc = normalize(`${it.descAr || ''} ${it.descEn || ''}`)
    const cat = catName[it.categoryId] || ''
    let score = 0
    let all = true
    for (const w of words) {
      if (name.includes(w)) score += name.startsWith(w) ? 5 : 3
      else if (desc.includes(w)) score += 2
      else if (cat.includes(w)) score += 1
      else { all = false; break }
    }
    if (all) scored.push({ it, score })
  }
  return scored.sort((a, b) => b.score - a.score || (a.it.order ?? 0) - (b.it.order ?? 0)).map((s) => s.it)
}
