// بيحوّل كل jpg/png بمجلد public/demo إلى WebP بحجم أصغر (وبيحذف الأصلي).
// التشغيل: npm run images
import { readdirSync, statSync, unlinkSync } from 'node:fs'
import { join, extname, basename } from 'node:path'
import sharp from 'sharp'

const DIR = 'public/demo'
// صور عريضة (سلايدر و"من نحن") أكبر من باقي الصور
const WIDE = /^(slide\d+|about)$/
let before = 0
let after = 0

for (const file of readdirSync(DIR)) {
  const ext = extname(file).toLowerCase()
  if (!['.jpg', '.jpeg', '.png'].includes(ext)) continue
  const name = basename(file, extname(file))
  const src = join(DIR, file)
  const out = join(DIR, `${name}.webp`)
  const maxWidth = WIDE.test(name) ? 1200 : 720

  await sharp(src)
    .rotate() // احترام اتجاه الصورة من الكاميرا
    .resize({ width: maxWidth, withoutEnlargement: true })
    .webp({ quality: 74, effort: 5 })
    .toFile(out)

  before += statSync(src).size
  after += statSync(out).size
  unlinkSync(src)
}

const kb = (n) => `${Math.round(n / 1024)}KB`
console.log(`قبل: ${kb(before)} → بعد: ${kb(after)}`)
