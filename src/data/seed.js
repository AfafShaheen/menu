const IMG = (name) => `${import.meta.env.BASE_URL}demo/${name}`

const cat = (id, nameAr, nameEn, order, extra = {}) => ({
  id, nameAr, nameEn, order,
  image: null, icon: 'restaurant_menu',
  descAr: '', descEn: '', introAr: '', introEn: '',
  tagsAr: '', tagsEn: '',
  bannerTitleAr: '', bannerTitleEn: '', bannerTextAr: '', bannerTextEn: '',
  ...extra,
})

const item = (id, categoryId, nameAr, nameEn, descAr, descEn, price, extra = {}) => ({
  id, categoryId, nameAr, nameEn, descAr, descEn, price,
  image: null, available: true, featured: false,
  badgeAr: '', badgeEn: '', badgeColor: 'primary',
  noteAr: '', noteEn: '',
  order: 0, ...extra,
})

export function getSeed() {
  return {
    categories: [
      cat('cat_appetizers', 'مقبلات', 'Appetizers', 1, {
        image: IMG('cat-appetizers.jpg'), icon: 'tapas',
        descAr: 'مازة شامية، فتوش، حمص', descEn: 'Levantine mezze, fattoush, hummus',
      }),
      cat('cat_mains', 'رئيسية', 'Main Dishes', 2, {
        image: IMG('cat-mains.jpg'), icon: 'dinner_dining',
        descAr: 'طواجن، فريكة، مناسف', descEn: 'Tagines, freekeh, mansaf',
      }),
      cat('cat_grills', 'مشاوي', 'Grills', 3, {
        image: IMG('cat-grills.jpg'), icon: 'local_fire_department',
        descAr: 'كباب حلبي، شيش، ريش', descEn: 'Aleppo kebab, shish, ribs',
        introAr: 'تشكيلة من أجود أنواع اللحوم الطازجة المتبلة بالبهارات الحلبية والشرقية الأصيلة والمشوية على الحطب الطبيعي.',
        introEn: 'A selection of the finest fresh meats, marinated in authentic Aleppo and Eastern spices and grilled over natural wood.',
        tagsAr: 'لحم غنم بلدي، دجاج طازج، تتبيلة حلبية خاصة',
        tagsEn: 'Local lamb, Fresh chicken, Special Aleppo marinade',
        bannerTitleAr: 'مشوياتنا تُحضر طازجة عند الطلب',
        bannerTitleEn: 'Our grills are prepared fresh to order',
        bannerTextAr: 'تستغرق المشاوي على الفحم بين 15 إلى 25 دقيقة لضمان النضج المثالي.',
        bannerTextEn: 'Charcoal grills take 15 to 25 minutes to ensure perfect doneness.',
      }),
      cat('cat_desserts', 'حلويات', 'Desserts', 4, {
        image: IMG('cat-desserts.jpg'), icon: 'bakery_dining',
        descAr: 'كنافة نابلسية، بقلاوة', descEn: 'Nabulsi kunafa, baklava',
      }),
      cat('cat_drinks', 'مشروبات', 'Drinks', 5, {
        image: IMG('cat-drinks.jpg'), icon: 'local_bar',
        descAr: 'جلاب، ليموناضة، قهوة', descEn: 'Jallab, lemonade, coffee',
      }),
      cat('cat_soups', 'شوربات وتنانير', 'Soups & Tanour', 6, {
        image: IMG('cat-soups.jpg'), icon: 'soup_kitchen',
        descAr: 'شوربة عدس، خبز طازج', descEn: 'Lentil soup, fresh bread',
      }),
    ],

    // ترتيب المصفوفة = ترتيب العرض
    items: [
      item('item_mixed_grill', 'cat_grills', 'مشاوي مشكلة سفرة فاخرة', 'Sufra Premium Mixed Grill', 'تشكيلة كباب، شيش طاووق، شقف خروف مع الخبز المحمص والصلصة الحارة', 'Kebab, shish tawook and lamb ribs with toasted bread and hot sauce', 120, { featured: true, image: IMG('mixed-grill.jpg'), badgeAr: 'الأكثر طلباً', badgeEn: 'Best seller', badgeColor: 'primary', noteAr: 'يكفي شخصين', noteEn: 'Serves two' }),
      item('item_fatteh', 'cat_mains', 'فتة باذنجان باللحم والمكسرات', 'Eggplant Fatteh with Meat and Nuts', 'باذنجان مشوي، لحمة بلدية ناعمة، صوص لبن ثومي مقرمش بالمكسرات', 'Grilled eggplant, tender minced beef, garlic yogurt sauce and crunchy nuts', 65, { featured: true, image: IMG('fatteh.jpg'), badgeAr: 'توصية الشيف', badgeEn: "Chef's pick", badgeColor: 'secondary' }),
      item('item_lamb_ribs', 'cat_grills', 'ريش ضأن متبلة بالزعتر البري', 'Wild Thyme Lamb Ribs', 'أربع قطع من ريش لحم الضأن البلدي الفاخر، مشوية على الفحم الهادئ مع خضار سوتيه وصلصة الثوم الخاصة.', 'Four pieces of premium local lamb ribs, charcoal grilled, served with sautéed vegetables and our garlic sauce.', 135, { image: IMG('lamb-ribs.jpg'), noteAr: '4 قطع', noteEn: '4 pieces' }),
      item('item_tawook', 'cat_grills', 'شيش طاووق بتتبيلة الزعفران', 'Saffron Shish Tawook', 'صدور دجاج طرية منقوعة باللبن والزعفران مع الثومية الخاصة', 'Tender chicken breast marinated in yogurt and saffron with our garlic sauce', 85, { featured: true, image: IMG('tawook.jpg'), noteAr: 'وجبة فردية', noteEn: 'Single serving' }),
      item('item_kibbeh', 'cat_appetizers', 'كبة صاجية حلبية مقرمشة', 'Crispy Aleppo Saj Kibbeh', 'محشوة باللحمة البلدية والجوز ودبس الرمان الطبيعي', 'Stuffed with lamb, walnuts and natural pomegranate molasses', 55, { featured: true, image: IMG('kibbeh.jpg') }),
      item('item_cherry_kebab', 'cat_grills', 'كباب بالكرز الحلبي الأصيل', 'Authentic Aleppo Cherry Kebab', 'كرات لحم الكباب الحلبي الفاخر مطبوخة بمرقة الكرز الحامض حلو ومزينة بالصنوبر المحمص والخبز المقطع.', 'Premium Aleppo kebab meatballs simmered in a sweet-and-sour cherry sauce, topped with toasted pine nuts and crispy bread.', 110, { available: false, image: IMG('cherry-kebab.jpg') }),
      item('item_arayes', 'cat_grills', 'عرايس لحمة على الفحم بالرمان', 'Charcoal Meat Arayes with Pomegranate', 'خبز عربي محشو بلحم الغنم البلدي المفروم مع النعناع والبهارات ودبس الرمان الطبيعي، محمص ومقرمش.', 'Arabic bread stuffed with minced local lamb, mint, spices and natural pomegranate molasses, toasted and crispy.', 65, { image: IMG('arayes.jpg'), noteAr: '4 مثلثات', noteEn: '4 triangles' }),
      item('item_hummus', 'cat_appetizers', 'حمص بالطحينة', 'Hummus', 'حمص ناعم بالطحينة وزيت الزيتون', 'Smooth chickpea dip with tahini and olive oil', 25, { image: IMG('hummus.jpg') }),
      item('item_mutabbal', 'cat_appetizers', 'متبل', 'Mutabbal', 'باذنجان مشوي مع الطحينة والثوم', 'Smoky grilled eggplant with tahini and garlic', 30, { image: IMG('mutabbal.jpg') }),
      item('item_mahashi', 'cat_mains', 'محاشي', 'Stuffed Vegetables', 'كوسا وباذنجان محشي بالأرز واللحمة', 'Zucchini and eggplant stuffed with rice and meat', 60, { image: IMG('mahashi.jpg') }),
      item('item_kunafa', 'cat_desserts', 'كنافة', 'Kunafa', 'كنافة بالجبنة والقطر', 'Cheese kunafa with sugar syrup', 40, { image: IMG('kunafa.jpg') }),
      item('item_baklava', 'cat_desserts', 'بقلاوة', 'Baklava', 'طبقات رقيقة بالفستق الحلبي', 'Thin layers with Aleppo pistachio', 35, { image: IMG('baklava.jpg') }),
      item('item_lemonade', 'cat_drinks', 'ليموناضة بالنعناع', 'Mint Lemonade', 'ليمون طازج مع النعناع', 'Fresh lemon with mint', 20, { image: IMG('lemonade.jpg') }),
      item('item_tea', 'cat_drinks', 'شاي', 'Tea', 'شاي ساخن', 'Hot tea', 10, { image: IMG('tea.jpg') }),
      item('item_lentil_soup', 'cat_soups', 'شوربة عدس', 'Lentil Soup', 'شوربة عدس أحمر كريمية مع خبز محمص وليمون', 'Creamy red lentil soup with toasted bread and lemon', 20, { image: IMG('lentil-soup.jpg') }),
      item('item_tanour', 'cat_soups', 'خبز تنور', 'Tanour Bread', 'خبز طازج من فرن الطين بالسمسم', 'Fresh clay-oven bread with sesame', 10, { image: IMG('tanour.jpg') }),
    ].map((it, i) => ({ ...it, order: i + 1 })),

    slides: [
      {
        id: 'slide_1', order: 1, image: IMG('slide1.jpg'),
        badgeAr: 'عرض مميز', badgeEn: 'Special offer', badgeColor: 'primary',
        titleAr: 'أشهى المأكولات الشرقية بنكهة أصيلة', titleEn: 'The finest Eastern cuisine with authentic flavor',
        subtitleAr: 'تذوق طعم المشاوي الحلبية والمقبلات الطازجة يومياً', subtitleEn: 'Taste Aleppo grills and fresh appetizers daily',
      },
      {
        id: 'slide_2', order: 2, image: IMG('slide2.jpg'),
        badgeAr: '', badgeEn: '', badgeColor: 'primary',
        titleAr: 'خصم 20% على طلبات العشاء العائلية', titleEn: '20% off family dinner orders',
        subtitleAr: 'شاركونا اللحظات الجميلة مع باقات العشاء الفاخرة', subtitleEn: 'Share the good moments with our dinner platters',
      },
      {
        id: 'slide_3', order: 3, image: IMG('slide3.jpg'),
        badgeAr: 'طازج كل يوم', badgeEn: 'Fresh every day', badgeColor: 'secondary',
        titleAr: 'أطباقنا اليومية طازجة ومحضرة بحب', titleEn: 'Our daily dishes, fresh and made with love',
        subtitleAr: 'مكونات عضوية وتتبيلات تروي أصالة الضيافة الدمشقية', subtitleEn: 'Organic ingredients and marinades that tell the story of Damascene hospitality',
      },
    ],

    settings: {
      nameAr: 'سفرة', nameEn: 'Sufra',
      fullNameAr: 'مطعم سفرة للمأكولات الشرقية', fullNameEn: 'Sufra Eastern Restaurant',
      logo: null,
      welcomeAr: 'أهلاً بكم في سفرة', welcomeEn: 'Welcome to Sufra',
      taglineAr: 'نكهاتٌ تُدفئ القلوب', taglineEn: 'Flavors that warm the heart',
      aboutSubtitleAr: 'أصالة الضيافة ودفء اللقاء', aboutSubtitleEn: 'Authentic hospitality, warm gatherings',
      aboutAr: 'في مطعم سفرة، نمزج بين أصالة المطبخ الشرقي واللمسة العصرية لنقدم لكم تجربة طعام لا تُنسى. نختار أجود المكونات المحلية الطازجة، ونطهو بوصفات عائلية متوارثة بروح متجددة تحتفي بكل نكهة على مائدتكم.',
      aboutEn: 'At Sufra, we blend authentic Eastern cuisine with a modern touch to offer you an unforgettable dining experience. We choose the finest fresh local ingredients and cook family recipes handed down through generations, with a renewed spirit that celebrates every flavor on your table.',
      aboutImage: IMG('about.jpg'),
      aboutImageCaptionAr: 'أجواء مريحة وعائلية', aboutImageCaptionEn: 'A cozy, family atmosphere',
      hoursAr: 'يومياً من 12:00 ظهراً حتى 12:00 منتصف الليل', hoursEn: 'Daily from 12:00 PM to 12:00 AM',
      hoursNoteAr: 'نستقبلكم طوال أيام الأسبوع', hoursNoteEn: 'Open every day of the week',
      addressAr: 'دمشق - المزة فيلات شرقية، شارع المطاعم', addressEn: 'Damascus - Mezzeh East Villas, Restaurants Street',
      mapUrl: 'https://www.google.com/maps/search/?api=1&query=Mezzeh+East+Villas+Damascus',
      mapImage: null,
      mapLabelAr: 'سفرة - المزة فيلات شرقية', mapLabelEn: 'Sufra - Mezzeh East Villas',
      whatsapp: '963988123456',
      phone: '0988123456',
      instagram: 'https://instagram.com',
      facebook: 'https://facebook.com',
      tiktok: 'https://tiktok.com',
    },
  }
}