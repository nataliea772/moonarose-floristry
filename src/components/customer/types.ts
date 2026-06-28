import { type ProductCategory } from "@/data/products";
import { type ProductTranslationFields } from "@/lib/productTranslations";

export type CustomerProduct = ProductTranslationFields & {
  id: string;
  category: ProductCategory;
  price: number;
  preparationDays: number;
  images: string[];
  image: string;
};

export type CustomerOrderSettings = {
  availableDatesCount: number;
};
