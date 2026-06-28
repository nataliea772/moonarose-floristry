"use client";

import { useState } from "react";
import { normalizeCustomerPhoneForWhatsApp } from "@/lib/orderWhatsApp";
import { ORDER_STATUS_LABELS } from "@/components/admin/constants";
import { PrimaryActionButton } from "@/components/admin/AdminUI";
import {
  buildDayOrderSummary,
  formatOrderDate,
  formatOrderTimestamp,
  getOrderStatusFilterLabel,
  matchesOrderStatusFilter,
  shiftDateKey,
  sortOrdersByStatusAndCreatedAt,
} from "@/components/admin/utils";
import {
  type AdminOrder,
  type OrderStatusFilter,
} from "@/components/admin/types";

type OrdersTabProps = {
  orders: AdminOrder[];
  isLoadingOrders: boolean;
  ordersError: string;
  orderStatusMessage: string;
  ordersSelectedDate: string;
  showAllOrders: boolean;
  updatingOrderId: string | null;
  onFetchOrders: () => void;
  onOrdersDateChange: (dateKey: string) => void;
  onShowAllOrders: () => void;
  onApproveOrder: (order: AdminOrder) => void;
  onCancelOrder: (order: AdminOrder) => void;
  onCompleteOrder: (order: AdminOrder) => void;
  onResendConfirmationWhatsApp: (order: AdminOrder) => void;
  onResendCancellationWhatsApp: (order: AdminOrder) => void;
  onResendCompletionWhatsApp: (order: AdminOrder) => void;
};

type SummaryFilterCard = {
  filter: OrderStatusFilter;
  value: number;
  label: string;
};

export function OrdersTab({
  orders,
  isLoadingOrders,
  ordersError,
  orderStatusMessage,
  ordersSelectedDate,
  showAllOrders,
  updatingOrderId,
  onFetchOrders,
  onOrdersDateChange,
  onShowAllOrders,
  onApproveOrder,
  onCancelOrder,
  onCompleteOrder,
  onResendConfirmationWhatsApp,
  onResendCancellationWhatsApp,
  onResendCompletionWhatsApp,
}: OrdersTabProps) {
  const [selectedStatusFilter, setSelectedStatusFilter] =
    useState<OrderStatusFilter>("all");

  const dateFilteredOrders = showAllOrders
    ? orders
    : orders.filter((order) => order.requestedDate === ordersSelectedDate);

  const dayOrderSummary = buildDayOrderSummary(dateFilteredOrders);

  const summaryCards: SummaryFilterCard[] = [
    { filter: "all", value: dayOrderSummary.total, label: "סה״כ הזמנות" },
    { filter: "new", value: dayOrderSummary.new, label: "חדשות" },
    { filter: "confirmed", value: dayOrderSummary.confirmed, label: "אושרו" },
    { filter: "cancelled", value: dayOrderSummary.cancelled, label: "בוטלו" },
    { filter: "completed", value: dayOrderSummary.completed, label: "הושלמו" },
    { filter: "open", value: dayOrderSummary.open, label: "דורשות טיפול" },
  ];

  const statusFilteredOrders = sortOrdersByStatusAndCreatedAt(
    dateFilteredOrders.filter((order) =>
      matchesOrderStatusFilter(order, selectedStatusFilter)
    )
  );

  const hasDateFilteredOrders = dateFilteredOrders.length > 0;
  const hasStatusFilteredOrders = statusFilteredOrders.length > 0;

  return (
    <section className="admin-panel">
      <div className="admin-section-header">
        <div>
          <h2 className="admin-section-title">הזמנות</h2>
          <p className="admin-section-desc">ניהול הזמנות לפי יום מבוקש</p>
        </div>

        <PrimaryActionButton onClick={onFetchOrders} disabled={isLoadingOrders}>
          רענון הזמנות
        </PrimaryActionButton>
      </div>

      <div className="admin-orders-day-controls">
        <div className="admin-orders-day-nav">
          <button
            type="button"
            className="admin-btn-secondary"
            onClick={() =>
              onOrdersDateChange(shiftDateKey(ordersSelectedDate, -1))
            }
          >
            יום קודם
          </button>
          <button
            type="button"
            className="admin-btn-secondary"
            onClick={() =>
              onOrdersDateChange(shiftDateKey(ordersSelectedDate, 1))
            }
          >
            יום הבא
          </button>
        </div>

        <label className="admin-orders-date-picker">
          <span className="admin-form-label">בחירת תאריך</span>
          <input
            type="date"
            className="admin-input"
            value={ordersSelectedDate}
            onChange={(event) => onOrdersDateChange(event.target.value)}
          />
        </label>

        <button
          type="button"
          className={`admin-btn-secondary admin-orders-all-btn ${
            showAllOrders ? "admin-category-chip-active" : ""
          }`}
          onClick={onShowAllOrders}
        >
          כל ההזמנות
        </button>
      </div>

      <h3 className="admin-orders-day-title">
        {showAllOrders
          ? "כל ההזמנות"
          : `הזמנות ליום ${formatOrderDate(ordersSelectedDate)}`}
      </h3>

      <div className="admin-orders-summary">
        {summaryCards.map((card) => {
          const isActive = selectedStatusFilter === card.filter;

          return (
            <button
              key={card.filter}
              type="button"
              className={`admin-orders-summary-card admin-orders-summary-card-button ${
                isActive ? "admin-orders-summary-card-active" : ""
              }`}
              onClick={() => setSelectedStatusFilter(card.filter)}
            >
              <span className="admin-orders-summary-value">{card.value}</span>
              <span className="admin-orders-summary-label">{card.label}</span>
            </button>
          );
        })}
      </div>

      <p className="admin-orders-filter-label">
        {getOrderStatusFilterLabel(selectedStatusFilter)}
      </p>

      {orderStatusMessage && (
        <p className="admin-message-success mb-4">{orderStatusMessage}</p>
      )}

      {ordersError && (
        <p className="admin-message-error mb-4">{ordersError}</p>
      )}

      {isLoadingOrders ? (
        <p className="admin-message-muted">טוען הזמנות...</p>
      ) : !hasDateFilteredOrders ? (
        <p className="admin-message-muted">
          {showAllOrders ? "אין הזמנות כרגע" : "אין הזמנות ליום זה"}
        </p>
      ) : !hasStatusFilteredOrders ? (
        <p className="admin-message-muted">אין הזמנות בקטגוריה הזו</p>
      ) : (
        <div className="admin-order-list">
          {statusFilteredOrders.map((order) => {
            const hasCustomerPhone = Boolean(
              normalizeCustomerPhoneForWhatsApp(order.customerPhone)
            );

            return (
              <article key={order.id} className="admin-order-item">
                <div className="admin-order-header">
                  <h3 className="admin-order-product">{order.customerName}</h3>
                  <span
                    className={`admin-order-status admin-order-status-${order.status}`}
                  >
                    {ORDER_STATUS_LABELS[order.status]}
                  </span>
                </div>

                <div className="admin-order-meta">
                  <p>
                    <span className="admin-order-label">טלפון:</span>{" "}
                    <span dir="ltr">{order.customerPhone}</span>
                  </p>
                  <p>
                    <span className="admin-order-label">מוצר:</span>{" "}
                    {order.productName}
                  </p>
                  <p>
                    <span className="admin-order-label">קטגוריה:</span>{" "}
                    {order.productCategory}
                  </p>
                  <p>
                    <span className="admin-order-label">מחיר:</span> ₪
                    {order.productPrice}
                  </p>
                  <p>
                    <span className="admin-order-label">תאריך מבוקש:</span>{" "}
                    {formatOrderDate(order.requestedDate)}
                  </p>
                  {order.notes && (
                    <p>
                      <span className="admin-order-label">הערות:</span>{" "}
                      {order.notes}
                    </p>
                  )}
                  <p className="admin-order-created">
                    <span className="admin-order-label">התקבלה:</span>{" "}
                    {formatOrderTimestamp(order.createdAt)}
                  </p>
                </div>

                <div className="admin-order-actions">
                  {order.status === "new" && (
                    <>
                      <button
                        type="button"
                        className="admin-order-action admin-order-action-confirm"
                        onClick={() => onApproveOrder(order)}
                        disabled={updatingOrderId === order.id}
                      >
                        אישור הזמנה
                      </button>
                      <button
                        type="button"
                        className="admin-order-action admin-order-action-cancel"
                        onClick={() => onCancelOrder(order)}
                        disabled={updatingOrderId === order.id}
                      >
                        ביטול הזמנה
                      </button>
                      {!hasCustomerPhone && (
                        <p className="admin-order-phone-missing">
                          אין מספר טלפון להזמנה
                        </p>
                      )}
                    </>
                  )}

                  {order.status === "confirmed" && (
                    <>
                      <button
                        type="button"
                        className="admin-order-action admin-order-action-complete"
                        onClick={() => onCompleteOrder(order)}
                        disabled={updatingOrderId === order.id}
                      >
                        סימון כהושלמה
                      </button>
                      {hasCustomerPhone ? (
                        <button
                          type="button"
                          className="admin-order-action admin-order-action-secondary"
                          onClick={() => onResendConfirmationWhatsApp(order)}
                        >
                          שליחת אישור שוב ב-WhatsApp
                        </button>
                      ) : (
                        <p className="admin-order-phone-missing">
                          אין מספר טלפון להזמנה
                        </p>
                      )}
                    </>
                  )}

                  {order.status === "cancelled" &&
                    (hasCustomerPhone ? (
                      <button
                        type="button"
                        className="admin-order-action admin-order-action-secondary"
                        onClick={() => onResendCancellationWhatsApp(order)}
                      >
                        שליחת הודעת ביטול שוב
                      </button>
                    ) : (
                      <p className="admin-order-phone-missing">
                        אין מספר טלפון להזמנה
                      </p>
                    ))}

                  {order.status === "completed" &&
                    (hasCustomerPhone ? (
                      <button
                        type="button"
                        className="admin-order-action admin-order-action-secondary"
                        onClick={() => onResendCompletionWhatsApp(order)}
                      >
                        שליחת בקשת דירוג שוב
                      </button>
                    ) : (
                      <p className="admin-order-phone-missing">
                        אין מספר טלפון להזמנה
                      </p>
                    ))}
                </div>
              </article>
            );
          })}
        </div>
      )}
    </section>
  );
}
