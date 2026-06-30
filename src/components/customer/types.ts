import {
  type ProductCategory,
  type ProductSubcategory,
} from "@/data/categories";
import { type ProductTranslationFields } from "@/lib/productTranslations";

export type CustomerProduct = ProductTranslationFields & {
  id: string;
  category: ProductCategory;
  subcategory: ProductSubcategory | null;
  price: number;
  preparationDays: number;
  isTopSeller: boolean;
  images: string[];
  image: string;
};

export type CustomerOrderSettings = {
  availableDatesCount: number;
};
