"use client";

import { useMemo, useState } from "react";
import { ORDER_STATUS_LABELS, weekdayLabels } from "@/components/admin/constants";
import { PrimaryActionButton } from "@/components/admin/AdminUI";
import {
  buildDayOrderSummary,
  formatMonthTitle,
  formatOrderDate,
  getMonthCalendarDays,
  groupOrdersByRequestedDate,
  sortOrdersByStatusAndCreatedAt,
  toDateKey,
} from "@/components/admin/utils";
import { type AdminOrder, type OrderStatus } from "@/components/admin/types";

type CalendarTabProps = {
  orders: AdminOrder[];
  isLoadingOrders: boolean;
  ordersError: string;
  onFetchOrders: () => void;
  onOpenInOrdersTab: (dateKey: string) => void;
};

type DayStatusCounts = Record<OrderStatus, number>;

const DAY_STATUS_CONFIG: {
  status: OrderStatus;
  label: string;
  dotClass: string;
}[] = [
  { status: "new", label: "חדשה", dotClass: "admin-journal-dot-new" },
  { status: "confirmed", label: "אושרה", dotClass: "admin-journal-dot-confirmed" },
  { status: "completed", label: "הושלמה", dotClass: "admin-journal-dot-completed" },
  { status: "cancelled", label: "בוטלה", dotClass: "admin-journal-dot-cancelled" },
];

function getDayStatusCounts(dayOrders: AdminOrder[]): DayStatusCounts {
  return {
    new: dayOrders.filter((order) => order.status === "new").length,
    confirmed: dayOrders.filter((order) => order.status === "confirmed").length,
    cancelled: dayOrders.filter((order) => order.status === "cancelled").length,
    completed: dayOrders.filter((order) => order.status === "completed").length,
  };
}

function formatOrderCountBadge(count: number): string {
  if (count === 1) {
    return "1 הזמנה";
  }

  return `${count} הזמנות`;
}

type JournalDayCellProps = {
  day: Date;
  dayOrders: AdminOrder[];
  isSelected: boolean;
  isToday: boolean;
  onSelect: (dateKey: string) => void;
};

function JournalDayCell({
  day,
  dayOrders,
  isSelected,
  isToday,
  onSelect,
}: JournalDayCellProps) {
  const dateKey = toDateKey(day);
  const counts = getDayStatusCounts(dayOrders);
  const activeStatuses = DAY_STATUS_CONFIG.filter(
    (entry) => counts[entry.status] > 0
  );
  const hasOrders = dayOrders.length > 0;

  return (
    <button
      type="button"
      className={`admin-journal-day ${
        isSelected ? "admin-journal-day-selected" : ""
      } ${isToday ? "admin-journal-day-today" : ""} ${
        hasOrders ? "admin-journal-day-has-orders" : ""
      }`}
      onClick={() => onSelect(dateKey)}
      aria-label={
        hasOrders
          ? `${day.getDate()}, ${formatOrderCountBadge(dayOrders.length)}`
          : `${day.getDate()}`
      }
    >
      <div className="admin-journal-day-top">
        <span className="admin-journal-day-number">{day.getDate()}</span>
      </div>

      {hasOrders && (
        <div className="admin-journal-day-body">
          <span className="admin-journal-day-badge">
            {formatOrderCountBadge(dayOrders.length)}
          </span>

          <div className="admin-journal-day-status">
            <div className="admin-journal-day-status-text">
              {activeStatuses.map((entry, index) => (
                <span key={entry.status} className="admin-journal-status-item">
                  {index > 0 && (
                    <span className="admin-journal-status-separator">·</span>
                  )}
                  <span
                    className={`admin-journal-dot ${entry.dotClass}`}
                    aria-hidden="true"
                  />
                  <span>
                    {entry.label} {counts[entry.status]}
                  </span>
                </span>
              ))}
            </div>

            <div className="admin-journal-day-status-dots" aria-hidden="true">
              {activeStatuses.map((entry) => (
                <span
                  key={entry.status}
                  className="admin-journal-dot-badge"
                  title={`${entry.label} ${counts[entry.status]}`}
                >
                  <span className={`admin-journal-dot ${entry.dotClass}`} />
                  <span className="admin-journal-dot-count">
                    {counts[entry.status]}
                  </span>
                </span>
              ))}
            </div>
          </div>
        </div>
      )}
    </button>
  );
}

export function CalendarTab({
  orders,
  isLoadingOrders,
  ordersError,
  onFetchOrders,
  onOpenInOrdersTab,
}: CalendarTabProps) {
  const todayKey = toDateKey(new Date());
  const [journalMonth, setJournalMonth] = useState(() => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), 1);
  });
  const [selectedDateKey, setSelectedDateKey] = useState(todayKey);

  const ordersByDate = useMemo(
    () => groupOrdersByRequestedDate(orders),
    [orders]
  );

  const calendarDays = getMonthCalendarDays(journalMonth);
  const selectedDayOrders = sortOrdersByStatusAndCreatedAt(
    ordersByDate.get(selectedDateKey) ?? []
  );
  const selectedDaySummary = buildDayOrderSummary(selectedDayOrders);

  const handleToday = () => {
    const now = new Date();
    setJournalMonth(new Date(now.getFullYear(), now.getMonth(), 1));
    setSelectedDateKey(todayKey);
  };

  const summaryCards = [
    { label: "סה״כ", value: selectedDaySummary.total },
    { label: "חדשות", value: selectedDaySummary.new },
    { label: "אושרו", value: selectedDaySummary.confirmed },
    { label: "הושלמו", value: selectedDaySummary.completed },
    { label: "בוטלו", value: selectedDaySummary.cancelled },
    { label: "דורשות טיפול", value: selectedDaySummary.open, highlight: true },
  ];

  return (
    <section className="admin-panel admin-journal-panel">
      <div className="admin-section-header">
        <div>
          <h2 className="admin-section-title">יומן הזמנות</h2>
          <p className="admin-section-desc">
            תצוגה חודשית של הזמנות לפי תאריך מבוקש
          </p>
        </div>

        <PrimaryActionButton onClick={onFetchOrders} disabled={isLoadingOrders}>
          רענון הזמנות
        </PrimaryActionButton>
      </div>

      {ordersError && (
        <p className="admin-message-error mb-4">{ordersError}</p>
      )}

      {isLoadingOrders ? (
        <p className="admin-message-muted">טוען הזמנות...</p>
      ) : (
        <div className="admin-journal-layout">
          <div className="admin-journal-calendar-panel">
            <div className="admin-journal-header">
              <div className="admin-journal-month-bar">
                <button
                  type="button"
                  className="admin-btn-secondary admin-journal-nav-btn"
                  onClick={() =>
                    setJournalMonth(
                      (previous) =>
                        new Date(
                          previous.getFullYear(),
                          previous.getMonth() - 1,
                          1
                        )
                    )
                  }
                >
                  חודש קודם
                </button>

                <h3 className="admin-journal-month-title">
                  {formatMonthTitle(journalMonth)}
                </h3>

                <button
                  type="button"
                  className="admin-btn-secondary admin-journal-nav-btn"
                  onClick={() =>
                    setJournalMonth(
                      (previous) =>
                        new Date(
                          previous.getFullYear(),
                          previous.getMonth() + 1,
                          1
                        )
                    )
                  }
                >
                  חודש הבא
                </button>
              </div>

              <button
                type="button"
                className="admin-btn-secondary admin-journal-today-btn"
                onClick={handleToday}
              >
                היום
              </button>
            </div>

            <div className="admin-journal-weekdays">
              {weekdayLabels.map((label) => (
                <div key={label} className="admin-journal-weekday">
                  {label}
                </div>
              ))}
            </div>

            <div className="admin-journal-calendar-grid">
              {calendarDays.map((day, index) => {
                if (!day) {
                  return (
                    <div
                      key={`empty-${index}`}
                      className="admin-journal-day-empty"
                      aria-hidden="true"
                    />
                  );
                }

                const dateKey = toDateKey(day);
                const dayOrders = ordersByDate.get(dateKey) ?? [];

                return (
                  <JournalDayCell
                    key={dateKey}
                    day={day}
                    dayOrders={dayOrders}
                    isSelected={selectedDateKey === dateKey}
                    isToday={dateKey === todayKey}
                    onSelect={setSelectedDateKey}
                  />
                );
              })}
            </div>
          </div>

          <div className="admin-journal-day-panel">
            <div className="admin-journal-day-panel-header">
              <div className="admin-journal-day-panel-title-block">
                <h3 className="admin-journal-day-title">
                  {formatOrderDate(selectedDateKey)}
                </h3>
                <p className="admin-journal-day-subtitle">
                  {selectedDaySummary.total === 0
                    ? "אין הזמנות ליום זה"
                    : `${selectedDaySummary.total} הזמנות ליום זה`}
                </p>
              </div>

              <button
                type="button"
                className="admin-btn-secondary admin-journal-manage-btn"
                onClick={() => onOpenInOrdersTab(selectedDateKey)}
              >
                ניהול בלשונית הזמנות
              </button>
            </div>

            {selectedDaySummary.total > 0 && (
              <div className="admin-journal-summary-grid">
                {summaryCards.map((card) => (
                  <div
                    key={card.label}
                    className={`admin-journal-summary-card ${
                      card.highlight ? "admin-journal-summary-card-highlight" : ""
                    }`}
                  >
                    <span className="admin-journal-summary-card-value">
                      {card.value}
                    </span>
                    <span className="admin-journal-summary-card-label">
                      {card.label}
                    </span>
                  </div>
                ))}
              </div>
            )}

            {selectedDayOrders.length === 0 ? (
              <div className="admin-journal-empty-state">
                אין הזמנות ליום שנבחר
              </div>
            ) : (
              <div className="admin-journal-order-list">
                {selectedDayOrders.map((order) => (
                  <article key={order.id} className="admin-journal-order-item">
                    <div className="admin-journal-order-header">
                      <div className="admin-journal-order-heading">
                        <h4 className="admin-journal-order-name">
                          {order.customerName}
                        </h4>
                        <p className="admin-journal-order-product">
                          {order.productName}
                        </p>
                      </div>
                      <span
                        className={`admin-order-status admin-order-status-${order.status}`}
                      >
                        {ORDER_STATUS_LABELS[order.status]}
                      </span>
                    </div>

                    <div className="admin-journal-order-meta">
                      <p>
                        <span className="admin-order-label">טלפון:</span>{" "}
                        <span dir="ltr">{order.customerPhone}</span>
                      </p>
                      <p>
                        <span className="admin-order-label">תאריך מבוקש:</span>{" "}
                        {formatOrderDate(order.requestedDate)}
                      </p>
                      {order.notes && (
                        <p className="admin-journal-order-notes">
                          <span className="admin-order-label">הערות:</span>{" "}
                          {order.notes}
                        </p>
                      )}
                    </div>
                  </article>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </section>
  );
}
