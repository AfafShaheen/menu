// الديمو: بترجع صورة مضغوطة كـ dataURL
// الإنتاج: نفس الدالة بترفع لـ Storage وبترجع رابط

// WebP أصغر بـ 25-35%، بس بعض المتصفحات (سفاري القديم) بتتجاهله وبترجع PNG ثقيل، فنتأكد قبل
let webpOk
export function supportsWebp() {
  if (webpOk === undefined) {
    try {
      webpOk = document.createElement('canvas').toDataURL('image/webp').startsWith('data:image/webp')
    } catch {
      webpOk = false
    }
  }
  return webpOk
}

export function uploadImage(file, { maxSize = 800, quality = 0.78, type } = {}) {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file)
    const img = new Image()
    img.onload = () => {
      const scale = Math.min(1, maxSize / Math.max(img.width, img.height))
      const canvas = document.createElement('canvas')
      canvas.width = Math.round(img.width * scale)
      canvas.height = Math.round(img.height * scale)
      canvas.getContext('2d').drawImage(img, 0, 0, canvas.width, canvas.height)
      URL.revokeObjectURL(url)
      resolve(canvas.toDataURL(type || (supportsWebp() ? 'image/webp' : 'image/jpeg'), quality))
    }
    img.onerror = () => {
      URL.revokeObjectURL(url)
      reject(new Error('IMAGE_LOAD_FAILED'))
    }
    img.src = url
  })
}
