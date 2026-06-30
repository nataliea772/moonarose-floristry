import type { Language } from "@/lib/translations";

export type ProductTranslationFields = {
  name: string;
  description: string;
  nameHe?: string;
  descriptionHe?: string;
  nameAr?: string;
  descriptionAr?: string;
  nameEn?: string;
  descriptionEn?: string;
};

export const PRODUCT_SELECT_COLUMNS =
  "id, name, description, category, subcategory, price, preparation_days, image_url, is_active, is_top_seller, created_at, name_he, description_he, name_ar, description_ar, name_en, description_en";

function pickTranslation(value: string | null | undefined): string | undefined {
  const trimmed = value?.trim();
  return trimmed ? trimmed : undefined;
}

export function getLocalizedProductName(
  product: ProductTranslationFields,
  language: Language
): string {
  switch (language) {
    case "he":
      return pickTranslation(product.nameHe) ?? product.name;
    case "ar":
      return (
        pickTranslation(product.nameAr) ??
        pickTranslation(product.nameHe) ??
        product.name
      );
    case "en":
      return (
        pickTranslation(product.nameEn) ??
        pickTranslation(product.nameHe) ??
        product.name
      );
  }
}

export function getLocalizedProductDescription(
  product: ProductTranslationFields,
  language: Language
): string {
  switch (language) {
    case "he":
      return pickTranslation(product.descriptionHe) ?? product.description;
    case "ar":
      return (
        pickTranslation(product.descriptionAr) ??
        pickTranslation(product.descriptionHe) ??
        product.description
      );
    case "en":
      return (
        pickTranslation(product.descriptionEn) ??
        pickTranslation(product.descriptionHe) ??
        product.description
      );
  }
}

export function hasProductLanguageTranslation(
  product: ProductTranslationFields,
  language: "ar" | "en"
): boolean {
  if (language === "ar") {
    return Boolean(pickTranslation(product.nameAr));
  }

  return Boolean(pickTranslation(product.nameEn));
}

export function mapProductTranslationFields(row: {
  name_he?: string | null;
  description_he?: string | null;
  name_ar?: string | null;
  description_ar?: string | null;
  name_en?: string | null;
  description_en?: string | null;
}): Pick<
  ProductTranslationFields,
  "nameHe" | "descriptionHe" | "nameAr" | "descriptionAr" | "nameEn" | "descriptionEn"
> {
  return {
    nameHe: pickTranslation(row.name_he),
    descriptionHe: pickTranslation(row.description_he),
    nameAr: pickTranslation(row.name_ar),
    descriptionAr: pickTranslation(row.description_ar),
    nameEn: pickTranslation(row.name_en),
    descriptionEn: pickTranslation(row.description_en),
  };
}
