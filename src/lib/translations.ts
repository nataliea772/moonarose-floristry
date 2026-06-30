import {
  PRODUCT_CATEGORIES,
  type ProductCategory,
  type ProductSubcategory,
} from "@/data/categories";

export type Language = "he" | "ar" | "en";

export const LANGUAGE_STORAGE_KEY = "moonarośe_language";

export const LANGUAGE_OPTIONS: { code: Language; label: string }[] = [
  { code: "he", label: "עברית" },
  { code: "ar", label: "العربية" },
  { code: "en", label: "English" },
];

const categoryLabels: Record<Language, Record<ProductCategory, string>> = {
  he: {
    זרים: "זרים",
    בוקסים: "בוקסים",
    "קישוט רכב": "קישוט רכב",
    חתונות: "חתונות",
    הפקות: "הפקות",
    "אירועים פרטיים": "אירועים פרטיים",
  },
  ar: {
    זרים: "باقات",
    בוקסים: "بوكسات",
    "קישוט רכב": "تزيين سيارات",
    חתונות: "أعراس",
    הפקות: "تنسيقات ومناسبات",
    "אירועים פרטיים": "مناسبات خاصة",
  },
  en: {
    זרים: "Bouquets",
    בוקסים: "Boxes",
    "קישוט רכב": "Car Decoration",
    חתונות: "Weddings",
    הפקות: "Events",
    "אירועים פרטיים": "Private Events",
  },
};

const categoryDescriptions: Record<
  Language,
  Record<ProductCategory, string>
> = {
  he: {
    זרים: "זרים מעוצבים לכל רגע מיוחד",
    בוקסים: "בוקסים אלגנטיים עם פרחים טריים",
    "קישוט רכב": "קישוט פרחים לרכב ליום המיוחד",
    חתונות: "פרחים לחתונה ולכל שלבי האירוע",
    הפקות: "עיצוב פרחים להפקות, צילומים ואירועים",
    "אירועים פרטיים": "פרחים לאירועים אינטימיים ורגעים אישיים",
  },
  ar: {
    זרים: "باقات مصممة للحظات المميزة",
    בוקסים: "بوكسات أنيقة بزهور طازجة",
    "קישוט רכב": "تزيين زهور للسيارة في يومك المميز",
    חתונות: "زهور للزفاف وكل مراحل الاحتفال",
    הפקות: "تنسيقات زهرية للإنتاج والتصوير والفعاليات",
    "אירועים פרטיים": "زهور للمناسبات الخاصة واللحظات الشخصية",
  },
  en: {
    זרים: "Styled bouquets for special moments",
    בוקסים: "Elegant boxes with fresh flowers",
    "קישוט רכב": "Floral car styling for your big day",
    חתונות: "Flowers for weddings and every celebration stage",
    הפקות: "Floral design for productions, shoots, and events",
    "אירועים פרטיים": "Flowers for intimate events and personal moments",
  },
};

const subcategoryLabels: Record<
  Language,
  Record<ProductSubcategory, string>
> = {
  he: {
    "מסיבת רווקות": "מסיבת רווקות",
    חתונות: "חתונות",
    "זרי כלה": "זרי כלה",
    "NEW BORN": "NEW BORN",
    "ימי הולדת": "ימי הולדת",
    "הצעת נישואין": "הצעת נישואין",
    "ברית / בריתה": "ברית / בריתה",
    "אירוח ביתי": "אירוח ביתי",
  },
  ar: {
    "מסיבת רווקות": "حفلة وداع العزوبية",
    חתונות: "أعراس",
    "זרי כלה": "باقات عروس",
    "NEW BORN": "مولود جديد",
    "ימי הולדת": "أعياد ميلاد",
    "הצעת נישואין": "عرض زواج",
    "ברית / בריתה": "Brit / Brita",
    "אירוח ביתי": "استضافة منزلية",
  },
  en: {
    "מסיבת רווקות": "Bridal Shower / Bachelorette",
    חתונות: "Weddings",
    "זרי כלה": "Bridal Bouquets",
    "NEW BORN": "NEW BORN",
    "ימי הולדת": "Birthdays",
    "הצעת נישואין": "Proposal",
    "ברית / בריתה": "Brit / Brita",
    "אירוח ביתי": "Home Hosting",
  },
};

export const translations = {
  he: {
    floralBoutique: "FLORAL BOUTIQUE",
    heroTagline: "כל פרח נושא רגש, כל סידור מספר סיפור.",
    phone: "טלפון",
    whatsapp: "WhatsApp",
    instagram: "Instagram",
    facebook: "Facebook",
    tiktok: "TikTok",
    loadingCollection: "טוען את הקולקציה...",
    loadError: "לא הצלחנו לטעון את הנתונים כרגע",
    noProducts: "מוצרים יתווספו בקרוב",
    chooseCategoryPrompt: "בחרי קטגוריה כדי לראות את הפריטים",
    backToCategories: "חזרה לקטגוריות",
    categoryEmptyLabel: "בקרוב",
    categoryEmptyTitle: "הפריטים בקטגוריה הזו יעלו בקרוב",
    categoryEmptyText:
      "להזמנה אישית או לפרטים נוספים אפשר לפנות אלינו ב-WhatsApp.",
    categoryEmptyWhatsApp: "פנייה ב-WhatsApp",
    customOrderWhatsAppMessage: (category: string, subcategoryText: string) =>
      `היי, אשמח לקבל פרטים על הזמנה אישית בקטגוריה: ${category}${subcategoryText} דרך moonarośe floristry.`,
    noProductsInCategory: "עדיין אין פריטים בקטגוריה הזו",
    subcategoryAll: "הכל",
    vanTeaserLabel: "בקרוב על גלגלים",
    vanTeaserTitle: "moonarośe on the road",
    vanTeaserText: "פרחים, קפה ורגעים יפים שמגיעים עד אלייך.",
    howItWorksTitle: "איך זה עובד?",
    howItWorksStep1Title: "בוחרים קטגוריה",
    howItWorksStep1Text: "מגלים את מגוון הזרים, הבוקסים והעיצובים שלנו",
    howItWorksStep2Title: "בוחרים פריט ותאריך",
    howItWorksStep2Text: "מתאימים את הבחירה לרגע שלך",
    howItWorksStep3Title: "אנחנו חוזרות אלייך",
    howItWorksStep3Text: "נחזור ב-WhatsApp לאישור המשך ותיאום הפרטים",
    consultationTitle: "לא בטוחה מה לבחור?",
    consultationText:
      "ספרי לנו למי זה מיועד,\nואנחנו נעזור לך לבחור משהו שמרגיש נכון.",
    consultationWhatsApp: "התייעצות ב-WhatsApp",
    consultationWhatsAppMessage:
      "היי, אשמח להתייעץ לגבי הזמנה מ-moonarośe floristry.",
    trustBenefitsAria: "יתרונות ושירות",
    trustBenefit1Title: "איסוף / תיאום אישי",
    trustBenefit1Subtitle: "בקלות ובנוחות",
    trustBenefit2Title: "עיצובים באהבה",
    trustBenefit2Subtitle: "מותאמים עבורך",
    trustBenefit3Title: "הזמנה לפי תאריך",
    trustBenefit3Subtitle: "להזמנה מושלמת",
    trustBenefit4Title: "אישור אישי",
    trustBenefit4Subtitle: "דרך WhatsApp",
    viewAllProducts: "צפייה בכל",
    carouselPrevious: "הקודם",
    carouselNext: "הבא",
    orderButton: "להזמנה",
    noRatingsYet: "עדיין אין דירוגים",
    ratingOutOfFive: (rating: number) => `${rating} מתוך 5`,
    reviewCount: (count: number) =>
      count === 1 ? "דירוג אחד" : `${count} דירוגים`,
    openGalleryAria: (name: string) => `פתיחת גלריית תמונות — ${name}`,
    galleryTitle: (name: string) => `גלריית תמונות — ${name}`,
    closeGallery: "סגירת גלריה",
    close: "סגירה",
    nextImage: "תמונה הבאה",
    previousImage: "תמונה קודמת",
    imageAlt: (name: string, index: number) => `${name} — תמונה ${index}`,
    orderEyebrow: "הזמנה",
    orderStep: (step: number) => `${step} מתוך 2`,
    prepDays: (days: number) => `זמן הכנה: ${days} ימים`,
    sameDayNotice: "הזמנות לא מתקבלות לאותו יום",
    dateSelectLabel: "בחרי תאריך לקבלת ההזמנה",
    dateSelectPlaceholder: "בחרי תאריך",
    continueToDetails: "המשך לפרטים",
    stepTwoEyebrow: "שלב 2",
    orderDetailsTitle: "פרטי ההזמנה",
    selectedDateLabel: "תאריך נבחר:",
    fullName: "שם מלא",
    phoneLabel: "טלפון",
    orderNotes: "הערות להזמנה",
    submitOrder: "שליחת הזמנה",
    submittingOrder: "שולחת הזמנה...",
    backToDate: "חזרה לבחירת תאריך",
    orderSuccessTitle: "ההזמנה נשלחה בהצלחה",
    orderSuccessText:
      "קיבלנו את הפרטים שלך ונחזור אלייך ב-WhatsApp לאישור אישי.",
    orderSuccessNote: "תודה שבחרת ב-moonarośe floristry",
    validationSelectDate: "בחרי תאריך להזמנה",
    validationFullName: "נא למלא שם מלא",
    validationPhone: "נא למלא מספר טלפון",
    orderSubmitError: "לא הצלחנו לשלוח את ההזמנה כרגע",
    whatsappHello: "שלום",
    envelopeIntroHint: "לחצי לפתיחה",
    envelopeIntroSkip: "דלגי",
  },
  ar: {
    floralBoutique: "FLORAL BOUTIQUE",
    heroTagline: "كل زهرة تحمل شعورًا، وكل تنسيق يروي قصة.",
    phone: "هاتف",
    whatsapp: "WhatsApp",
    instagram: "Instagram",
    facebook: "Facebook",
    tiktok: "TikTok",
    loadingCollection: "جاري تحميل المجموعة...",
    loadError: "لم نتمكن من تحميل البيانات حالياً",
    noProducts: "سيتم إضافة منتجات قريباً",
    chooseCategoryPrompt: "اختاري فئة لعرض المنتجات",
    backToCategories: "العودة للفئات",
    categoryEmptyLabel: "قريبًا",
    categoryEmptyTitle: "سيتم إضافة المنتجات في هذه الفئة قريبًا",
    categoryEmptyText:
      "لطلب خاص أو لمزيد من التفاصيل يمكنكِ التواصل معنا عبر WhatsApp.",
    categoryEmptyWhatsApp: "تواصل عبر WhatsApp",
    customOrderWhatsAppMessage: (category: string, subcategoryText: string) =>
      `مرحبًا، أود الحصول على تفاصيل حول طلب خاص ضمن فئة: ${category}${subcategoryText} من moonarośe floristry.`,
    noProductsInCategory: "لا توجد منتجات في هذه الفئة بعد",
    subcategoryAll: "الكل",
    vanTeaserLabel: "قريبًا على عجلات",
    vanTeaserTitle: "moonarośe on the road",
    vanTeaserText: "زهور، قهوة ولحظات جميلة تصل إليكِ.",
    howItWorksTitle: "كيف يعمل؟",
    howItWorksStep1Title: "اختاري فئة",
    howItWorksStep1Text: "اكتشفي الباقات، البوكسات والتنسيقات",
    howItWorksStep2Title: "اختاري المنتج والتاريخ",
    howItWorksStep2Text: "اختاري ما يناسب لحظتك",
    howItWorksStep3Title: "نعود إليكِ",
    howItWorksStep3Text: "نتواصل عبر WhatsApp للتأكيد",
    consultationTitle: "لستِ متأكدة ماذا تختارين؟",
    consultationText:
      "أخبرينا لمن الهدية، وسنساعدكِ باختيار شيء مناسب.",
    consultationWhatsApp: "استشارة عبر WhatsApp",
    consultationWhatsAppMessage:
      "مرحبًا، أود استشارة بخصوص طلب من moonarośe floristry.",
    trustBenefitsAria: "المزايا والخدمة",
    trustBenefit1Title: "استلام / تنسيق شخصي",
    trustBenefit1Subtitle: "بسهولة وراحة",
    trustBenefit2Title: "تصاميم بالحب",
    trustBenefit2Subtitle: "مصممة من أجلكِ",
    trustBenefit3Title: "طلب حسب التاريخ",
    trustBenefit3Subtitle: "لطلب مثالي",
    trustBenefit4Title: "تأكيد شخصي",
    trustBenefit4Subtitle: "عبر WhatsApp",
    viewAllProducts: "عرض الكل",
    carouselPrevious: "السابق",
    carouselNext: "التالي",
    orderButton: "للطلب",
    noRatingsYet: "لا توجد تقييمات بعد",
    ratingOutOfFive: (rating: number) => `${rating} من 5`,
    reviewCount: (count: number) =>
      count === 1 ? "تقييم واحد" : `${count} تقييمات`,
    openGalleryAria: (name: string) => `فتح معرض الصور — ${name}`,
    galleryTitle: (name: string) => `معرض الصور — ${name}`,
    closeGallery: "إغلاق المعرض",
    close: "إغلاق",
    nextImage: "الصورة التالية",
    previousImage: "الصورة السابقة",
    imageAlt: (name: string, index: number) => `${name} — صورة ${index}`,
    orderEyebrow: "طلب",
    orderStep: (step: number) => `${step} من 2`,
    prepDays: (days: number) => `وقت التحضير: ${days} أيام`,
    sameDayNotice: "لا نقبل الطلبات لنفس اليوم",
    dateSelectLabel: "اختاري تاريخ استلام الطلب",
    dateSelectPlaceholder: "اختاري تاريخاً",
    continueToDetails: "المتابعة للتفاصيل",
    stepTwoEyebrow: "الخطوة 2",
    orderDetailsTitle: "تفاصيل الطلب",
    selectedDateLabel: "التاريخ المختار:",
    fullName: "الاسم الكامل",
    phoneLabel: "هاتف",
    orderNotes: "ملاحظات للطلب",
    submitOrder: "إرسال الطلب",
    submittingOrder: "جاري إرسال الطلب...",
    backToDate: "العودة لاختيار التاريخ",
    orderSuccessTitle: "تم إرسال الطلب بنجاح",
    orderSuccessText:
      "استلمنا التفاصيل وسنعود إليكِ عبر WhatsApp لتأكيد الطلب بشكل شخصي.",
    orderSuccessNote: "شكرًا لاختيارك moonarośe floristry",
    validationSelectDate: "يرجى اختيار تاريخ للطلب",
    validationFullName: "يرجى إدخال الاسم الكامل",
    validationPhone: "يرجى إدخال رقم الهاتف",
    orderSubmitError: "لم نتمكن من إرسال الطلب حالياً",
    whatsappHello: "مرحباً",
    envelopeIntroHint: "اضغطي للفتح",
    envelopeIntroSkip: "تخطي",
  },
  en: {
    floralBoutique: "FLORAL BOUTIQUE",
    heroTagline:
      "Every flower carries a feeling, every arrangement tells a story.",
    phone: "Phone",
    whatsapp: "WhatsApp",
    instagram: "Instagram",
    facebook: "Facebook",
    tiktok: "TikTok",
    loadingCollection: "Loading the collection...",
    loadError: "We couldn't load the data right now",
    noProducts: "Products coming soon",
    chooseCategoryPrompt: "Choose a category to view the pieces",
    backToCategories: "Back to categories",
    categoryEmptyLabel: "Coming soon",
    categoryEmptyTitle: "Pieces in this category are coming soon",
    categoryEmptyText:
      "For a custom order or more details, you can contact us on WhatsApp.",
    categoryEmptyWhatsApp: "Contact on WhatsApp",
    customOrderWhatsAppMessage: (category: string, subcategoryText: string) =>
      `Hi, I would like more details about a custom order in: ${category}${subcategoryText} from moonarośe floristry.`,
    noProductsInCategory: "No pieces in this category yet",
    subcategoryAll: "All",
    vanTeaserLabel: "Coming soon on wheels",
    vanTeaserTitle: "moonarośe on the road",
    vanTeaserText: "Flowers, coffee and beautiful moments coming to you.",
    howItWorksTitle: "How it works?",
    howItWorksStep1Title: "Choose a category",
    howItWorksStep1Text: "Explore bouquets, boxes and floral designs",
    howItWorksStep2Title: "Choose item & date",
    howItWorksStep2Text: "Pick what fits your moment",
    howItWorksStep3Title: "We contact you",
    howItWorksStep3Text: "We confirm personally on WhatsApp",
    consultationTitle: "Not sure what to choose?",
    consultationText:
      "Tell us who it is for, and we will help you choose something that feels right.",
    consultationWhatsApp: "Consult on WhatsApp",
    consultationWhatsAppMessage:
      "Hi, I would like a consultation about an order from moonarośe floristry.",
    trustBenefitsAria: "Benefits and service",
    trustBenefit1Title: "Pickup / personal coordination",
    trustBenefit1Subtitle: "Easy and comfortable",
    trustBenefit2Title: "Designs with love",
    trustBenefit2Subtitle: "Made for you",
    trustBenefit3Title: "Order by date",
    trustBenefit3Subtitle: "For a perfect order",
    trustBenefit4Title: "Personal confirmation",
    trustBenefit4Subtitle: "Via WhatsApp",
    viewAllProducts: "View all",
    carouselPrevious: "Previous",
    carouselNext: "Next",
    orderButton: "Order",
    noRatingsYet: "No ratings yet",
    ratingOutOfFive: (rating: number) => `${rating} out of 5`,
    reviewCount: (count: number) =>
      count === 1 ? "1 rating" : `${count} ratings`,
    openGalleryAria: (name: string) => `Open photo gallery — ${name}`,
    galleryTitle: (name: string) => `Photo gallery — ${name}`,
    closeGallery: "Close gallery",
    close: "Close",
    nextImage: "Next image",
    previousImage: "Previous image",
    imageAlt: (name: string, index: number) => `${name} — image ${index}`,
    orderEyebrow: "Order",
    orderStep: (step: number) => `${step} of 2`,
    prepDays: (days: number) => `Preparation time: ${days} days`,
    sameDayNotice: "Same-day orders are not accepted",
    dateSelectLabel: "Choose a delivery date",
    dateSelectPlaceholder: "Choose a date",
    continueToDetails: "Continue to details",
    stepTwoEyebrow: "Step 2",
    orderDetailsTitle: "Order details",
    selectedDateLabel: "Selected date:",
    fullName: "Full name",
    phoneLabel: "Phone",
    orderNotes: "Order notes",
    submitOrder: "Submit order",
    submittingOrder: "Sending order...",
    backToDate: "Back to date selection",
    orderSuccessTitle: "Your order was sent successfully",
    orderSuccessText:
      "We received your details and will contact you on WhatsApp for a personal confirmation.",
    orderSuccessNote: "Thank you for choosing moonarośe floristry",
    validationSelectDate: "Please choose an order date",
    validationFullName: "Please enter your full name",
    validationPhone: "Please enter your phone number",
    orderSubmitError: "We couldn't send the order right now",
    whatsappHello: "Hello",
    envelopeIntroHint: "Click to open",
    envelopeIntroSkip: "Skip",
  },
} as const;

export type TranslationKey = keyof (typeof translations)["he"];

export function isLanguage(value: string): value is Language {
  return value === "he" || value === "ar" || value === "en";
}

export function getTranslations(language: Language) {
  return translations[language];
}

export function getCategoryLabel(
  category: ProductCategory,
  language: Language
): string {
  return categoryLabels[language][category];
}

export function getCategoryDescription(
  category: ProductCategory,
  language: Language
): string {
  return categoryDescriptions[language][category];
}

export function getSubcategoryLabel(
  subcategory: ProductSubcategory,
  language: Language
): string {
  return subcategoryLabels[language][subcategory];
}

export function getDateLocale(language: Language): string {
  if (language === "ar") {
    return "ar-SA";
  }

  if (language === "en") {
    return "en-US";
  }

  return "he-IL";
}

export function getTextDirection(language: Language): "rtl" | "ltr" {
  return language === "en" ? "ltr" : "rtl";
}

export const productCategories = PRODUCT_CATEGORIES;
