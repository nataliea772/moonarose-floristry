import {
  products as defaultProducts,
  type ProductCategory,
} from "@/data/products";
import {
  resolveProductImageUrls,
  type ProductImageRecord,
} from "@/lib/productImages";
import { mapProductTranslationFields } from "@/lib/productTranslations";
import { productCategories } from "@/lib/translations";
import { type ProductReview } from "@/lib/reviews";
import { type CustomerProduct } from "@/components/customer/types";

export type SupabaseProductRow = {
  id: string;
  name: string;
  category: string;
  description: string;
  price: number | string;
  preparation_days: number;
  image_url: string | null;
  name_he?: string | null;
  description_he?: string | null;
  name_ar?: string | null;
  description_ar?: string | null;
  name_en?: string | null;
  description_en?: string | null;
};

export type SupabaseClosedDateRow = {
  closed_date: string;
};

export type SupabaseContactRow = {
  phone: string | null;
  whatsapp: string | null;
  instagram: string | null;
  facebook: string | null;
  tiktok: string | null;
};

export type SupabaseOrderSettingsRow = {
  available_dates_count: number;
  allow_same_day: boolean;
};

export type SupabaseReviewRow = {
  id: string;
  product_id: string;
  customer_name: string;
  rating: number;
  comment: string | null;
  created_at: string;
};

const productCategoriesList = productCategories;

export function isProductCategory(value: string): value is ProductCategory {
  return productCategoriesList.includes(value as ProductCategory);
}

export function mapSupabaseReview(row: SupabaseReviewRow): ProductReview {
  return {
    id: row.id,
    productId: row.product_id,
    customerName: row.customer_name,
    rating: row.rating,
    comment: row.comment,
    createdAt: row.created_at,
  };
}

export function mapDefaultProducts(): CustomerProduct[] {
  return defaultProducts.map((product) => ({
    id: String(product.id),
    name: product.name,
    category: product.category,
    description: product.description,
    price: product.price,
    preparationDays: product.preparationDays,
    images: product.image ? [product.image] : [],
    image: product.image,
  }));
}

export function mapSupabaseProduct(
  row: SupabaseProductRow,
  groupedImages: Map<string, ProductImageRecord[]>
): CustomerProduct | null {
  if (!isProductCategory(row.category)) {
    return null;
  }

  const images = resolveProductImageUrls(row.id, row.image_url, groupedImages);

  return {
    id: row.id,
    name: row.name,
    category: row.category,
    description: row.description,
    ...mapProductTranslationFields(row),
    price: Number(row.price),
    preparationDays: row.preparation_days,
    images,
    image: images[0] ?? "",
  };
}

export function toClosedDateKey(value: string): string {
  if (/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return value;
  }

  const date = new Date(value);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function toDateKey(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function getAvailableDates(
  preparationDays: number,
  closedDates: string[],
  count: number
): Date[] {
  const dates: Date[] = [];
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const closedSet = new Set(closedDates);
  let offset = preparationDays;

  while (dates.length < count && offset < preparationDays + 365) {
    const date = new Date(today);
    date.setDate(date.getDate() + offset);

    if (!closedSet.has(toDateKey(date))) {
      dates.push(date);
    }

    offset++;
  }

  return dates;
}

export function parseDateFromKey(dateKey: string): Date | null {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(dateKey)) {
    return null;
  }

  const [year, month, day] = dateKey.split("-").map(Number);
  return new Date(year, month - 1, day);
}

export { productCategories as productCategoriesList };
