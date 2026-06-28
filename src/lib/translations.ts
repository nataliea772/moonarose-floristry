import { type ProductCategory } from "@/data/products";

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
    הפקות: "הפקות",
  },
  ar: {
    זרים: "باقات",
    בוקסים: "بوكسات",
    הפקות: "تنسيقات",
  },
  en: {
    זרים: "Bouquets",
    בוקסים: "Boxes",
    הפקות: "Events",
  },
};

const categoryDescriptions: Record<
  Language,
  Record<ProductCategory, string>
> = {
  he: {
    זרים: "זרים מעוצבים לאירועים, מתנות ורגעים מיוחדים",
    בוקסים: "בוקסים אלגנטיים עם פרחים בעיצוב אישי",
    הפקות: "עיצובי פרחים להפקות, אירועים וצילומים",
  },
  ar: {
    זרים: "باقات زهرية مصممة للمناسبات والهدايا واللحظات المميزة",
    בוקסים: "بوكسات أنيقة بزهور بتصميم شخصي",
    הפקות: "تنسيقات زهرية للإنتاج والفعاليات والتصوير",
  },
  en: {
    זרים: "Designed bouquets for events, gifts, and special moments",
    בוקסים: "Elegant boxes with personally styled flowers",
    הפקות: "Floral styling for productions, events, and photoshoots",
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
    orderSuccessText: "נחזור אלייך בהודעת WhatsApp לאישור ההזמנה",
    validationSelectDate: "בחרי תאריך להזמנה",
    validationFullName: "נא למלא שם מלא",
    validationPhone: "נא למלא מספר טלפון",
    orderSubmitError: "לא הצלחנו לשלוח את ההזמנה כרגע",
    whatsappHello: "שלום",
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
    orderSuccessText: "سنعود إليك برسالة WhatsApp لتأكيد الطلب",
    validationSelectDate: "يرجى اختيار تاريخ للطلب",
    validationFullName: "يرجى إدخال الاسم الكامل",
    validationPhone: "يرجى إدخال رقم الهاتف",
    orderSubmitError: "لم نتمكن من إرسال الطلب حالياً",
    whatsappHello: "مرحباً",
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
    orderSuccessTitle: "Order sent successfully",
    orderSuccessText: "We will contact you on WhatsApp to confirm your order",
    validationSelectDate: "Please choose an order date",
    validationFullName: "Please enter your full name",
    validationPhone: "Please enter your phone number",
    orderSubmitError: "We couldn't send the order right now",
    whatsappHello: "Hello",
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

export const productCategories: ProductCategory[] = ["זרים", "בוקסים", "הפקות"];
