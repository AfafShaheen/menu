// الديمو: بترجع صورة مضغوطة كـ dataURL
// الإنتاج: نفس الدالة بترفع لـ Storage وبترجع رابط
export function uploadImage(file, { maxSize = 800, quality = 0.8, type = 'image/jpeg' } = {}) {
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
      resolve(canvas.toDataURL(type, quality))
    }
    img.onerror = () => {
      URL.revokeObjectURL(url)
      reject(new Error('IMAGE_LOAD_FAILED'))
    }
    img.src = url
  })
}