export type ProductCategory =
  | "זרים"
  | "בוקסים"
  | "קישוט רכב"
  | "חתונות"
  | "הפקות"
  | "מתנות"
  | "אירועים פרטיים";

export type WeddingSubcategory =
  | "מסיבת רווקות"
  | "חתונות"
  | "זרי כלה"
  | "חינה כלה";

export type ProductionsSubcategory = "NEW BORN" | "ימי הולדת";

export type PrivateEventsSubcategory = "הצעת נישואין";

export type ProductSubcategory =
  | WeddingSubcategory
  | ProductionsSubcategory
  | PrivateEventsSubcategory;

export const PRODUCT_CATEGORIES: ProductCategory[] = [
  "זרים",
  "בוקסים",
  "קישוט רכב",
  "חתונות",
  "הפקות",
  "מתנות",
  "אירועים פרטיים",
];

export const CATEGORY_SUBCATEGORIES: Partial<
  Record<ProductCategory, readonly ProductSubcategory[]>
> = {
  חתונות: ["מסיבת רווקות", "חתונות", "זרי כלה", "חינה כלה"],
  הפקות: ["NEW BORN", "ימי הולדת"],
  "אירועים פרטיים": ["הצעת נישואין"],
};

export const SUBCATEGORY_FILTER_ALL = "הכל" as const;

export type SubcategoryFilter = ProductSubcategory | typeof SUBCATEGORY_FILTER_ALL;

const subcategoryValues = new Set<ProductSubcategory>(
  Object.values(CATEGORY_SUBCATEGORIES).flatMap((subcategories) => [
    ...(subcategories ?? []),
  ])
);

export function isProductCategory(value: string): value is ProductCategory {
  return PRODUCT_CATEGORIES.includes(value as ProductCategory);
}

export function isProductSubcategory(value: string): value is ProductSubcategory {
  return subcategoryValues.has(value as ProductSubcategory);
}

export function getSubcategoriesForCategory(
  category: ProductCategory
): ProductSubcategory[] {
  return [...(CATEGORY_SUBCATEGORIES[category] ?? [])];
}

export function categoryHasSubcategories(category: ProductCategory): boolean {
  return getSubcategoriesForCategory(category).length > 0;
}

export function normalizeProductSubcategory(
  category: ProductCategory,
  value: string | null | undefined
): ProductSubcategory | null {
  if (!value?.trim()) {
    return null;
  }

  const trimmed = value.trim();
  const allowed = CATEGORY_SUBCATEGORIES[category];

  if (!allowed?.includes(trimmed as ProductSubcategory)) {
    return null;
  }

  return trimmed as ProductSubcategory;
}
