import { type ProductCategory, type ProductSubcategory } from "@/data/categories";
import { type ContactDetails } from "@/lib/contactStorage";
import { type ProductImageRecord } from "@/lib/productImages";
import { type ProductTranslationFields } from "@/lib/productTranslations";

export type AdminProduct = ProductTranslationFields & {
  id: string;
  category: ProductCategory;
  subcategory: ProductSubcategory | null;
  price: number;
  preparationDays: number;
  isTopSeller: boolean;
  images: ProductImageRecord[];
  image: string;
};

export type ClosedDate = {
  id: string;
  closedDate: string;
  reason: string | null;
};

export type AdminTab =
  | "מוצרים"
  | "ימים סגורים"
  | "פרטי קשר"
  | "הגדרות הזמנות"
  | "הזמנות"
  | "יומן"
  | "ביקורות";

export type AdminReview = {
  id: string;
  productId: string;
  productName: string;
  orderId: string;
  customerName: string;
  rating: number;
  comment: string | null;
  isVisible: boolean;
  createdAt: string;
};

export type OrderStatus = "new" | "confirmed" | "cancelled" | "completed";

export type AdminOrder = {
  id: string;
  productId: string;
  productName: string;
  productCategory: string;
  productPrice: number;
  customerName: string;
  customerPhone: string;
  requestedDate: string;
  status: OrderStatus;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
};

export type ProductFormState = {
  name: string;
  category: ProductCategory;
  subcategory: string;
  description: string;
  nameAr: string;
  descriptionAr: string;
  nameEn: string;
  descriptionEn: string;
  price: string;
  preparationDays: string;
  isTopSeller: boolean;
};

export type PendingImagePreview = {
  id: string;
  file: File;
  preview: string;
};

export type DayOrderSummary = {
  total: number;
  new: number;
  confirmed: number;
  cancelled: number;
  completed: number;
  open: number;
};

export type OrderStatusFilter =
  | "all"
  | "new"
  | "confirmed"
  | "cancelled"
  | "completed"
  | "open";

export type { ContactDetails };
