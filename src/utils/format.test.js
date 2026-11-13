import { describe, expect, it } from 'vitest'
import { countLabel, formatNumber, formatPhone, formatPrice } from './format'

describe('format', () => {
  it('السعر بعملة اللغة', () => {
    expect(formatPrice(1250, 'ar')).toBe('1,250 ل.س')
    expect(formatPrice(1250, 'en')).toBe('1,250 SYP')
    expect(formatNumber(0)).toBe('0')
  })

  it('رقم الهاتف بيتقسّم لمجموعات', () => {
    expect(formatPhone('0988123456')).toBe('0988 123 456')
    expect(formatPhone('')).toBe('')
  })

  it('عدد الأصناف بالمفرد والمثنى والجمع العربي', () => {
    expect(countLabel(1, 'ar')).toBe('صنف واحد')
    expect(countLabel(2, 'ar')).toBe('صنفان')
    expect(countLabel(5, 'ar')).toBe('5 أصناف')
    expect(countLabel(11, 'ar')).toBe('11 صنف')
    expect(countLabel(1, 'en')).toBe('1 item')
    expect(countLabel(4, 'en')).toBe('4 items')
  })
})
