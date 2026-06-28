import { type ProductCategory, normalizeProductSubcategory } from "@/data/categories";
import { type ContactDetails } from "@/lib/contactStorage";
import {
  DEFAULT_ORDER_SETTINGS,
  normalizeAvailableDatesCountForSelect,
  type OrderSettings,
} from "@/lib/orderSettingsStorage";
import {
  groupProductImagesByProductId,
  resolveProductImageUrls,
  type ProductImageRecord,
} from "@/lib/productImages";
import { mapProductTranslationFields } from "@/lib/productTranslations";
import {
  ORDER_STATUSES,
  ORDER_STATUS_LABELS,
  productCategories,
} from "@/components/admin/constants";
import {
  type AdminOrder,
  type AdminProduct,
  type AdminReview,
  type ClosedDate,
  type OrderStatus,
  type OrderStatusFilter,
  type ProductFormState,
} from "@/components/admin/types";

export type SupabaseProductRow = {
  id: string;
  name: string;
  category: string;
  subcategory?: string | null;
  description: string;
  price: number | string;
  preparation_days: number;
  image_url: string | null;
  is_active: boolean;
  created_at: string;
  name_he?: string | null;
  description_he?: string | null;
  name_ar?: string | null;
  description_ar?: string | null;
  name_en?: string | null;
  description_en?: string | null;
};

export type SupabaseClosedDateRow = {
  id: string;
  closed_date: string;
  reason: string | null;
  created_at: string;
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
  order_id: string;
  customer_name: string;
  rating: number;
  comment: string | null;
  is_visible: boolean;
  created_at: string;
};

export type SupabaseOrderRow = {
  id: string;
  product_id: string;
  product_name: string;
  product_category: string;
  product_price: number | string;
  customer_name: string;
  customer_phone: string;
  requested_date: string;
  status: string;
  notes: string | null;
  created_at: string;
  updated_at: string;
};

export function isOrderStatus(value: string): value is OrderStatus {
  return ORDER_STATUSES.includes(value as OrderStatus);
}

export function isProductCategory(value: string): value is ProductCategory {
  return productCategories.includes(value as ProductCategory);
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

export function shiftDateKey(dateKey: string, days: number): string {
  const [year, month, day] = dateKey.split("-").map(Number);
  const date = new Date(year, month - 1, day);
  date.setDate(date.getDate() + days);
  return toDateKey(date);
}

export function mapSupabaseOrder(row: SupabaseOrderRow): AdminOrder | null {
  if (!isOrderStatus(row.status)) {
    return null;
  }

  return {
    id: row.id,
    productId: row.product_id,
    productName: row.product_name,
    productCategory: row.product_category,
    productPrice: Number(row.product_price),
    customerName: row.customer_name,
    customerPhone: row.customer_phone,
    requestedDate: toClosedDateKey(row.requested_date),
    status: row.status,
    notes: row.notes,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export function formatOrderDate(dateString: string): string {
  const [year, month, day] = dateString.split("-").map(Number);
  const date = new Date(year, month - 1, day);
  return date.toLocaleDateString("he-IL", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export function formatOrderTimestamp(value: string): string {
  return new Date(value).toLocaleString("he-IL", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function formatReviewTimestamp(value: string): string {
  return formatOrderTimestamp(value);
}

export function mapSupabaseReview(
  row: SupabaseReviewRow,
  productNames: Map<string, string>
): AdminReview {
  return {
    id: row.id,
    productId: row.product_id,
    productName: productNames.get(row.product_id) ?? "",
    orderId: row.order_id,
    customerName: row.customer_name,
    rating: row.rating,
    comment: row.comment,
    isVisible: row.is_visible,
    createdAt: row.created_at,
  };
}

export function renderReviewStars(rating: number): string {
  return "★".repeat(Math.max(1, Math.min(5, Math.round(rating))));
}

export function mapSupabaseProduct(
  row: SupabaseProductRow,
  groupedImages: Map<string, ProductImageRecord[]>
): AdminProduct | null {
  if (!isProductCategory(row.category)) {
    return null;
  }

  const productImages = groupedImages.get(row.id) ?? [];
  const imageUrls = resolveProductImageUrls(row.id, row.image_url, groupedImages);

  return {
    id: row.id,
    name: row.name,
    category: row.category,
    subcategory: normalizeProductSubcategory(row.category, row.subcategory),
    description: row.description,
    ...mapProductTranslationFields(row),
    price: Number(row.price),
    preparationDays: row.preparation_days,
    images: productImages,
    image: imageUrls[0] ?? "",
  };
}

export function mapSupabaseClosedDate(row: SupabaseClosedDateRow): ClosedDate {
  return {
    id: row.id,
    closedDate: toClosedDateKey(row.closed_date),
    reason: row.reason,
  };
}

export function mapSupabaseContactDetails(row: SupabaseContactRow): ContactDetails {
  return {
    phone: row.phone ?? "",
    whatsapp: row.whatsapp ?? "",
    instagram: row.instagram ?? "",
    facebook: row.facebook ?? "",
    tiktok: row.tiktok ?? "",
  };
}

export function mapSupabaseOrderSettings(row: SupabaseOrderSettingsRow): OrderSettings {
  const count = row.available_dates_count ?? DEFAULT_ORDER_SETTINGS.availableDatesCount;

  return {
    availableDatesCount: normalizeAvailableDatesCountForSelect(count),
  };
}

export function emptyProductForm(
  category: ProductCategory = "זרים"
): ProductFormState {
  return {
    name: "",
    category,
    subcategory: "",
    description: "",
    nameAr: "",
    descriptionAr: "",
    nameEn: "",
    descriptionEn: "",
    price: "",
    preparationDays: "",
  };
}

export function formatClosedDate(dateString: string): string {
  const [year, month, day] = dateString.split("-").map(Number);
  const date = new Date(year, month - 1, day);
  return date.toLocaleDateString("he-IL");
}

export function getMonthCalendarDays(monthDate: Date): (Date | null)[] {
  const year = monthDate.getFullYear();
  const month = monthDate.getMonth();
  const firstDay = new Date(year, month, 1);
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const leadingEmptyDays = firstDay.getDay();
  const days: (Date | null)[] = [];

  for (let i = 0; i < leadingEmptyDays; i++) {
    days.push(null);
  }

  for (let day = 1; day <= daysInMonth; day++) {
    days.push(new Date(year, month, day));
  }

  return days;
}

export function formatMonthTitle(monthDate: Date): string {
  return monthDate.toLocaleDateString("he-IL", {
    month: "long",
    year: "numeric",
  });
}

export function productToFormState(product: AdminProduct): ProductFormState {
  return {
    name: product.nameHe ?? product.name,
    category: product.category,
    subcategory: product.subcategory ?? "",
    description: product.descriptionHe ?? product.description,
    nameAr: product.nameAr ?? "",
    descriptionAr: product.descriptionAr ?? "",
    nameEn: product.nameEn ?? "",
    descriptionEn: product.descriptionEn ?? "",
    price: String(product.price),
    preparationDays: String(product.preparationDays),
  };
}

export function buildProductTranslationPayload(form: ProductFormState) {
  const hebrewName = form.name.trim();
  const hebrewDescription = form.description.trim();
  const nameAr = form.nameAr.trim();
  const descriptionAr = form.descriptionAr.trim();
  const nameEn = form.nameEn.trim();
  const descriptionEn = form.descriptionEn.trim();

  return {
    name: hebrewName,
    description: hebrewDescription,
    name_he: hebrewName,
    description_he: hebrewDescription,
    name_ar: nameAr || null,
    description_ar: descriptionAr || null,
    name_en: nameEn || null,
    description_en: descriptionEn || null,
  };
}

export function getAdminProductHebrewName(product: AdminProduct): string {
  return product.nameHe ?? product.name;
}

export function getAdminProductHebrewDescription(product: AdminProduct): string {
  return product.descriptionHe ?? product.description;
}

export function createPreviewId(): string {
  return `preview-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

const ORDER_STATUS_SORT_PRIORITY: Record<OrderStatus, number> = {
  new: 0,
  confirmed: 1,
  completed: 2,
  cancelled: 3,
};

export function sortOrdersByStatusAndCreatedAt(
  orders: AdminOrder[]
): AdminOrder[] {
  return [...orders].sort((left, right) => {
    const statusDiff =
      ORDER_STATUS_SORT_PRIORITY[left.status] -
      ORDER_STATUS_SORT_PRIORITY[right.status];

    if (statusDiff !== 0) {
      return statusDiff;
    }

    return (
      new Date(right.createdAt).getTime() - new Date(left.createdAt).getTime()
    );
  });
}

export function matchesOrderStatusFilter(
  order: AdminOrder,
  filter: OrderStatusFilter
): boolean {
  if (filter === "all") {
    return true;
  }

  if (filter === "open") {
    return order.status === "new" || order.status === "confirmed";
  }

  return order.status === filter;
}

export function getOrderStatusFilterLabel(filter: OrderStatusFilter): string {
  const labels: Record<OrderStatusFilter, string> = {
    all: "מציגה את כל ההזמנות",
    new: "מציגה הזמנות חדשות בלבד",
    confirmed: "מציגה הזמנות שאושרו בלבד",
    cancelled: "מציגה הזמנות שבוטלו בלבד",
    completed: "מציגה הזמנות שהושלמו בלבד",
    open: "מציגה הזמנות שדורשות טיפול",
  };

  return labels[filter];
}

export function buildDayOrderSummary(orders: AdminOrder[]) {
  return {
    total: orders.length,
    new: orders.filter((order) => order.status === "new").length,
    confirmed: orders.filter((order) => order.status === "confirmed").length,
    cancelled: orders.filter((order) => order.status === "cancelled").length,
    completed: orders.filter((order) => order.status === "completed").length,
    open: orders.filter(
      (order) => order.status === "new" || order.status === "confirmed"
    ).length,
  };
}

export function groupOrdersByRequestedDate(
  orders: AdminOrder[]
): Map<string, AdminOrder[]> {
  const grouped = new Map<string, AdminOrder[]>();

  for (const order of orders) {
    const existing = grouped.get(order.requestedDate) ?? [];
    existing.push(order);
    grouped.set(order.requestedDate, existing);
  }

  return grouped;
}

function escapeCsvField(value: string | number): string {
  const text = String(value ?? "");

  if (/[",\n\r]/.test(text)) {
    return `"${text.replace(/"/g, '""')}"`;
  }

  return text;
}

function getOrderPrice(order: AdminOrder): number {
  return Number.isFinite(order.productPrice) ? order.productPrice : 0;
}

export function getCurrentMonthKey(): string {
  const now = new Date();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  return `${now.getFullYear()}-${month}`;
}

export function filterCompletedOrdersByRequestedMonth(
  orders: AdminOrder[],
  monthKey: string
): AdminOrder[] {
  return orders.filter(
    (order) =>
      order.status === "completed" && order.requestedDate.startsWith(monthKey)
  );
}

export function buildCompletedOrdersCsv(orders: AdminOrder[]): string {
  const headers = [
    "מספר הזמנה",
    "תאריך יצירה",
    "תאריך מבוקש",
    "שם לקוחה",
    "טלפון",
    "מוצר",
    "מחיר",
    "סטטוס",
    "הערות",
  ];

  const sortedOrders = [...orders].sort((left, right) => {
    const requestedDateCompare = left.requestedDate.localeCompare(
      right.requestedDate
    );

    if (requestedDateCompare !== 0) {
      return requestedDateCompare;
    }

    return left.createdAt.localeCompare(right.createdAt);
  });

  const rows = sortedOrders.map((order) =>
    [
      order.id,
      formatOrderTimestamp(order.createdAt),
      formatOrderDate(order.requestedDate),
      order.customerName,
      order.customerPhone,
      order.productName,
      getOrderPrice(order),
      ORDER_STATUS_LABELS[order.status],
      order.notes ?? "",
    ]
      .map(escapeCsvField)
      .join(",")
  );

  const totalOrders = sortedOrders.length;
  const totalIncome = sortedOrders.reduce(
    (sum, order) => sum + getOrderPrice(order),
    0
  );

  const summaryRows = [
    "",
    [escapeCsvField("סה״כ הזמנות שהושלמו"), totalOrders].join(","),
    [escapeCsvField("סה״כ הכנסות"), totalIncome].join(","),
  ];

  return [headers.map(escapeCsvField).join(","), ...rows, ...summaryRows].join("\r\n");
}

export function downloadCompletedOrdersReport(
  orders: AdminOrder[],
  monthKey: string
): void {
  const csv = buildCompletedOrdersCsv(orders);
  const blob = new Blob([`\uFEFF${csv}`], {
    type: "text/csv;charset=utf-8;",
  });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `moonarose-completed-orders-${monthKey}.csv`;
  link.click();
  URL.revokeObjectURL(url);
}

export { groupProductImagesByProductId };
