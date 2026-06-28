import { PRODUCT_CATEGORIES, type ProductCategory } from "@/data/categories";
import { type AdminTab, type OrderStatus } from "@/components/admin/types";

export const CLOSED_DATE_REASON = "סגור להזמנות";

export const adminTabs: AdminTab[] = [
  "מוצרים",
  "ימים סגורים",
  "פרטי קשר",
  "הגדרות הזמנות",
  "הזמנות",
  "יומן",
  "ביקורות",
];

export const ORDER_STATUSES: OrderStatus[] = [
  "new",
  "confirmed",
  "cancelled",
  "completed",
];

export const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
  new: "חדשה",
  confirmed: "אושרה",
  cancelled: "בוטלה",
  completed: "הושלמה",
};

export const productCategories = PRODUCT_CATEGORIES;

export const weekdayLabels = ["א'", "ב'", "ג'", "ד'", "ה'", "ו'", "ש'"];

export const inputClassName = "admin-input";
