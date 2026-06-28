"use client";

import { AVAILABLE_DATES_COUNT_OPTIONS } from "@/lib/orderSettingsStorage";
import {
  FormField,
  inputClassName,
  PrimaryActionButton,
} from "@/components/admin/AdminUI";

type OrderSettingsTabProps = {
  isLoadingOrderSettings: boolean;
  orderSettingsLoadError: string;
  availableDatesInput: string;
  onAvailableDatesInputChange: (value: string) => void;
  orderSettingsError: string;
  orderSettingsMessage: string;
  isSavingOrderSettings: boolean;
  onSaveOrderSettings: () => void;
};

export function OrderSettingsTab({
  isLoadingOrderSettings,
  orderSettingsLoadError,
  availableDatesInput,
  onAvailableDatesInputChange,
  orderSettingsError,
  orderSettingsMessage,
  isSavingOrderSettings,
  onSaveOrderSettings,
}: OrderSettingsTabProps) {
  return (
    <section className="admin-panel">
      <h2 className="admin-section-title mb-6">הגדרות הזמנות</h2>

      {isLoadingOrderSettings ? (
        <p className="admin-message-muted">טוען הגדרות הזמנות...</p>
      ) : orderSettingsLoadError ? (
        <p className="admin-message-error">{orderSettingsLoadError}</p>
      ) : (
        <>
          <div className="admin-settings-notes">
            <div className="admin-note-card">הזמנות לא מתקבלות לאותו יום</div>
            <div className="admin-note-card">
              תאריכים מוצגים לפי זמן ההכנה של כל מוצר
            </div>
          </div>

          <FormField label="מספר תאריכים זמינים שיופיעו ללקוח">
            <select
              className={inputClassName}
              value={availableDatesInput}
              onChange={(event) => onAvailableDatesInputChange(event.target.value)}
            >
              {AVAILABLE_DATES_COUNT_OPTIONS.map((option) => (
                <option key={option} value={option}>
                  {option} תאריכים
                </option>
              ))}
            </select>
          </FormField>

          {orderSettingsError && (
            <p className="admin-message-error mt-4">{orderSettingsError}</p>
          )}

          {orderSettingsMessage && (
            <p className="admin-message-success mt-4">{orderSettingsMessage}</p>
          )}

          <div className="mt-6">
            <PrimaryActionButton
              onClick={onSaveOrderSettings}
              disabled={isSavingOrderSettings}
            >
              {isSavingOrderSettings ? "שומרת..." : "שמירת הגדרות"}
            </PrimaryActionButton>
          </div>
        </>
      )}
    </section>
  );
}
