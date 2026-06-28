"use client";

import { weekdayLabels } from "@/components/admin/constants";
import {
  formatClosedDate,
  formatMonthTitle,
  toDateKey,
} from "@/components/admin/utils";
import { type ClosedDate } from "@/components/admin/types";

type ClosedDatesTabProps = {
  isLoadingClosedDates: boolean;
  closedDatesError: string;
  calendarMonth: Date;
  onCalendarMonthChange: (updater: (previous: Date) => Date) => void;
  calendarDays: (Date | null)[];
  closedDatesSet: Set<string>;
  closedDates: ClosedDate[];
  onToggleCalendarDate: (dateKey: string) => void;
  onReopenClosedDate: (dateKey: string) => void;
};

export function ClosedDatesTab({
  isLoadingClosedDates,
  closedDatesError,
  calendarMonth,
  onCalendarMonthChange,
  calendarDays,
  closedDatesSet,
  closedDates,
  onToggleCalendarDate,
  onReopenClosedDate,
}: ClosedDatesTabProps) {
  return (
    <section className="admin-panel">
      <h2 className="admin-section-title mb-2">ימים סגורים להזמנות</h2>
      <p className="admin-section-desc mb-2">
        ניתן לסגור יום במקרה של חופש, עומס הזמנות או כל סיבה אחרת.
      </p>
      <p className="admin-helper-text mb-6">
        לחצו על תאריך בלוח השנה כדי לסגור או לפתוח אותו להזמנות.
      </p>

      {isLoadingClosedDates ? (
        <p className="admin-message-muted mb-6">טוען ימים סגורים...</p>
      ) : closedDatesError ? (
        <p className="admin-message-error mb-6">{closedDatesError}</p>
      ) : (
        <>
          <div className="admin-calendar-panel">
            <div className="admin-calendar-header">
              <h3 className="admin-calendar-title">
                {formatMonthTitle(calendarMonth)}
              </h3>
              <div className="admin-calendar-nav">
                <button
                  type="button"
                  className="contact-btn min-h-11 px-4 py-2 text-sm"
                  onClick={() =>
                    onCalendarMonthChange(
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
                <button
                  type="button"
                  className="contact-btn min-h-11 px-4 py-2 text-sm"
                  onClick={() =>
                    onCalendarMonthChange(
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
            </div>

            <div className="admin-calendar-weekdays">
              {weekdayLabels.map((label) => (
                <div key={label} className="admin-calendar-weekday">
                  {label}
                </div>
              ))}
            </div>

            <div className="admin-calendar-grid">
              {calendarDays.map((day, index) => {
                if (!day) {
                  return (
                    <div
                      key={`empty-${index}`}
                      className="admin-calendar-day-empty"
                    />
                  );
                }

                const dateKey = toDateKey(day);
                const isClosed = closedDatesSet.has(dateKey);

                return (
                  <button
                    key={dateKey}
                    type="button"
                    onClick={() => onToggleCalendarDate(dateKey)}
                    className={`admin-calendar-day ${
                      isClosed ? "admin-calendar-day-closed" : ""
                    }`}
                  >
                    <span>{day.getDate()}</span>
                    {isClosed && (
                      <span className="admin-calendar-day-label">סגור</span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          <h3 className="admin-subheading">ימים סגורים שנבחרו</h3>

          {closedDates.length === 0 ? (
            <div className="admin-note-card admin-message-muted">
              אין ימים סגורים כרגע
            </div>
          ) : (
            <div className="grid gap-3">
              {closedDates.map((entry) => (
                <div key={entry.id} className="admin-list-item">
                  <div>
                    <span className="font-medium text-[#3b2521]">
                      {formatClosedDate(entry.closedDate)}
                    </span>
                    {entry.reason && (
                      <p className="mt-1 text-sm text-[#755d56]">
                        {entry.reason}
                      </p>
                    )}
                  </div>
                  <button
                    type="button"
                    className="contact-btn min-h-11 px-4 py-2 text-sm"
                    onClick={() => onReopenClosedDate(entry.closedDate)}
                  >
                    פתיחה מחדש
                  </button>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </section>
  );
}
