// رسالة مفهومة لكل خطأ ممكن يطلع من طبقة البيانات
export function describeError(e) {
  switch (e?.message) {
    case 'STORAGE_FULL':
      return 'مساحة التخزين امتلأت. جرّبي صوراً أصغر أو احذفي صوراً غير مستخدمة.'
    case 'MAX_SLIDES':
      return 'الحد الأقصى 10 شرائح.'
    case 'INVALID_BACKUP':
      return 'هذا الملف ليس نسخة احتياطية صالحة.'
    case 'ITEM_NOT_FOUND':
      return 'الصنف غير موجود (ممكن انحذف).'
    default:
      return 'صار خطأ، حاولي مرة ثانية.'
  }
}
