import { buildWhatsAppHref } from "@/lib/contactStorage";
import { BRAND_NAME } from "@/lib/brand";

export type OrderWhatsAppDetails = {
  customerName: string;
  productName: string;
  requestedDateLabel: string;
  productPrice: number;
};

export function normalizeCustomerPhoneForWhatsApp(phone: string): string {
  const digits = phone.trim().replace(/[\s\-()+]/g, "").replace(/\D/g, "");

  if (!digits) {
    return "";
  }

  if (digits.startsWith("972")) {
    return digits;
  }

  if (digits.startsWith("0")) {
    return `972${digits.slice(1)}`;
  }

  return digits;
}

export function buildOrderConfirmationMessage(
  order: OrderWhatsAppDetails
): string {
  return [
    `שלום ${order.customerName}, ההזמנה שלך מ-${BRAND_NAME} אושרה.`,
    `מוצר: ${order.productName}`,
    `תאריך: ${order.requestedDateLabel}`,
    `מחיר: ₪${order.productPrice}`,
    "נשמח לראותך",
  ].join("\n");
}

export function buildOrderCancellationMessage(
  order: Pick<OrderWhatsAppDetails, "customerName" | "productName" | "requestedDateLabel">
): string {
  return [
    `שלום ${order.customerName}, לצערנו ההזמנה שלך מ-${BRAND_NAME} לא אושרה / בוטלה.`,
    `מוצר: ${order.productName}`,
    `תאריך: ${order.requestedDateLabel}`,
    "נשמח לעזור לך לבחור מועד אחר.",
  ].join("\n");
}

export function buildReviewRequestMessage(order: {
  customerName: string;
  reviewLink: string;
}): string {
  return [
    `שלום ${order.customerName}, תודה שהזמנת ${BRAND_NAME}.`,
    "נשמח לשמוע איך הייתה החוויה שלך.",
    "אפשר להשאיר דירוג קצר כאן:",
    order.reviewLink,
  ].join("\n");
}

export function buildCustomerWhatsAppHref(
  phone: string,
  message: string
): string {
  const normalized = normalizeCustomerPhoneForWhatsApp(phone);
  if (!normalized) {
    return "";
  }

  return buildWhatsAppHref(normalized, message);
}

export function openCustomerWhatsApp(phone: string, message: string): boolean {
  const href = buildCustomerWhatsAppHref(phone, message);
  if (!href) {
    return false;
  }

  window.open(href, "_blank", "noopener,noreferrer");
  return true;
}
