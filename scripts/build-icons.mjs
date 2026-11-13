// بيولّد خط أيقونات صغير (فقط الأيقونات المستخدمة) ليتخزّن مع المشروع بدل ما نحمّل 3MB من Google.
// التشغيل: npm run icons   (لازم إنترنت). أضيفي أي اسم جديد للقائمة تحت وشغّلي الأمر مرة ثانية.
import { mkdirSync, writeFileSync } from 'node:fs'
import { CATEGORY_ICONS } from '../src/data/icons.js'

const UI_ICONS = [
  'add', 'add_shopping_cart', 'admin_panel_settings', 'arrow_back', 'arrow_forward', 'backup', 'block',
  'call', 'category', 'chat', 'check', 'check_circle', 'close', 'content_copy', 'dashboard', 'delete',
  'download', 'drag_indicator', 'edit', 'error', 'info', 'keyboard_arrow_down', 'keyboard_arrow_up',
  'location_on', 'lock', 'login', 'logout', 'lunch_dining', 'music_note', 'open_in_new', 'percent',
  'photo_camera', 'pin_drop', 'public', 'remove', 'restaurant', 'restaurant_menu', 'restart_alt', 'save',
  'schedule', 'search', 'search_off', 'send', 'settings', 'shopping_basket', 'skillet', 'star',
  'star_outline', 'stars', 'storefront', 'translate', 'upload', 'view_carousel', 'visibility', 'warning',
]

const names = [...new Set([...UI_ICONS, ...CATEGORY_ICONS.map((i) => i.name)])].sort()
const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36'
const cssUrl =
  'https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,0..1,0' +
  `&icon_names=${names.join(',')}&display=block`

const css = await (await fetch(cssUrl, { headers: { 'User-Agent': UA } })).text()
const woff = css.match(/url\((https:[^)]+)\)/)?.[1]
if (!woff) {
  console.error('تعذّر جلب الخط. تأكدي من أسماء الأيقونات:\n', css.slice(0, 400))
  process.exit(1)
}
const buf = Buffer.from(await (await fetch(woff)).arrayBuffer())
mkdirSync('src/assets/fonts', { recursive: true })
writeFileSync('src/assets/fonts/material-symbols.woff2', buf)
console.log(`${names.length} icons, ${Math.round(buf.length / 1024)}KB`)
