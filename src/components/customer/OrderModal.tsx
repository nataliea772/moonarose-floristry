"use client";

import { ProductImage } from "@/components/ProductImage";
import { type CustomerProduct } from "@/components/customer/types";
import { toDateKey } from "@/components/customer/utils";
import { getLocalizedProductName } from "@/lib/productTranslations";
import { useModalA11y } from "@/lib/useModalA11y";
import { getCategoryLabel, getTranslations, type Language } from "@/lib/translations";

type CustomerTranslations = ReturnType<typeof getTranslations>;

type OrderModalProps = {
  product: CustomerProduct;
  language: Language;
  translations: CustomerTranslations;
  orderStep: 1 | 2;
  orderSuccess: boolean;
  selectedDateKey: string;
  selectedDate: Date | null;
  availableDates: Date[];
  customerName: string;
  customerPhone: string;
  orderNotes: string;
  orderFormError: string;
  isSubmittingOrder: boolean;
  formatDateOptionLabel: (date: Date) => string;
  onClose: () => void;
  onSelectedDateKeyChange: (dateKey: string) => void;
  onCustomerNameChange: (value: string) => void;
  onCustomerPhoneChange: (value: string) => void;
  onOrderNotesChange: (value: string) => void;
  onContinueToDetails: () => void;
  onBackToDate: () => void;
  onSubmitOrder: () => void;
};

export function OrderModal({
  product,
  language,
  translations: t,
  orderStep,
  orderSuccess,
  selectedDateKey,
  selectedDate,
  availableDates,
  customerName,
  customerPhone,
  orderNotes,
  orderFormError,
  isSubmittingOrder,
  formatDateOptionLabel,
  onClose,
  onSelectedDateKeyChange,
  onCustomerNameChange,
  onCustomerPhoneChange,
  onOrderNotesChange,
  onContinueToDetails,
  onBackToDate,
  onSubmitOrder,
}: OrderModalProps) {
  const panelRef = useModalA11y(true, onClose);
  const hasFormError = orderFormError.length > 0;
  const dateErrorId = "order-date-error";
  const detailsErrorId = "order-details-error";

  return (
    <div
      className="order-modal-overlay fixed inset-0 z-50 flex items-end justify-center p-3 sm:items-center sm:p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="order-modal-title"
    >
      <div
        className="order-modal-backdrop absolute inset-0"
        onClick={onClose}
        aria-hidden="true"
      />

      <div
        ref={panelRef}
        className="order-modal-card relative max-h-[92vh] w-full max-w-md overflow-x-hidden overflow-y-auto"
      >
        <div className="order-modal-topbar">
          {!orderSuccess && (
            <span className="order-modal-step">{t.orderStep(orderStep)}</span>
          )}
          <button
            type="button"
            className="order-modal-close"
            onClick={onClose}
            aria-label={t.close}
          >
            ×
          </button>
        </div>

        {orderSuccess ? (
          <div
            className="order-modal-body order-success-view"
            role="status"
            aria-live="polite"
          >
            <div className="order-success-emblem" aria-hidden="true">
              <span className="order-success-moon" />
              <span className="order-success-petal" />
            </div>
            <h2 id="order-modal-title" className="order-success-title">
              {t.orderSuccessTitle}
            </h2>
            <p className="order-success-text">{t.orderSuccessText}</p>
            <p className="order-success-note">{t.orderSuccessNote}</p>

            <div className="order-modal-actions">
              <button type="button" className="order-btn" onClick={onClose}>
                {t.close}
              </button>
            </div>
          </div>
        ) : orderStep === 1 ? (
          <div className="order-modal-body">
            <p className="order-modal-eyebrow">{t.orderEyebrow}</p>

            <div className="order-product-summary">
              <div className="order-product-image-wrap">
                <ProductImage
                  src={product.image}
                  alt={getLocalizedProductName(product, language)}
                  className="order-product-image"
                />
              </div>
              <div className="order-product-details">
                <h2 id="order-modal-title" className="order-product-name">
                  {getLocalizedProductName(product, language)}
                </h2>
                <p className="order-product-category">
                  {getCategoryLabel(product.category, language)}
                </p>
                <p className="order-product-price">₪{product.price}</p>
                <p className="order-product-prep">
                  {t.prepDays(product.preparationDays)}
                </p>
              </div>
            </div>

            <p className="order-notice">{t.sameDayNotice}</p>

            <label className="order-form-field" htmlFor="order-date-select">
              <span className="order-form-label">{t.dateSelectLabel}</span>
              <select
                id="order-date-select"
                className="order-form-input order-date-select"
                value={selectedDateKey}
                aria-invalid={hasFormError && !selectedDateKey}
                aria-describedby={hasFormError ? dateErrorId : undefined}
                onChange={(event) => {
                  onSelectedDateKeyChange(event.target.value);
                }}
              >
                <option value="" disabled>
                  {t.dateSelectPlaceholder}
                </option>
                {availableDates.map((date) => {
                  const dateKey = toDateKey(date);

                  return (
                    <option key={dateKey} value={dateKey}>
                      {formatDateOptionLabel(date)}
                    </option>
                  );
                })}
              </select>
            </label>

            {orderFormError && (
              <p id={dateErrorId} className="order-form-error" role="alert">
                {orderFormError}
              </p>
            )}

            <div className="order-modal-actions">
              <button type="button" className="order-btn" onClick={onContinueToDetails}>
                {t.continueToDetails}
              </button>
            </div>
          </div>
        ) : (
          <div className="order-modal-body">
            <p className="order-modal-eyebrow">{t.stepTwoEyebrow}</p>
            <h2 id="order-modal-title" className="order-step-title">
              {t.orderDetailsTitle}
            </h2>

            {selectedDate && (
              <div className="order-selected-date">
                <span className="order-selected-date-label">
                  {t.selectedDateLabel}
                </span>
                <span>{formatDateOptionLabel(selectedDate)}</span>
              </div>
            )}

            <div className="order-form-fields">
              <label className="order-form-field" htmlFor="order-customer-name">
                <span className="order-form-label">{t.fullName}</span>
                <input
                  id="order-customer-name"
                  type="text"
                  className="order-form-input"
                  value={customerName}
                  aria-invalid={hasFormError && !customerName.trim()}
                  aria-describedby={hasFormError ? detailsErrorId : undefined}
                  onChange={(event) => {
                    onCustomerNameChange(event.target.value);
                  }}
                  disabled={isSubmittingOrder}
                  autoComplete="name"
                />
              </label>

              <label className="order-form-field" htmlFor="order-customer-phone">
                <span className="order-form-label">{t.phoneLabel}</span>
                <input
                  id="order-customer-phone"
                  type="tel"
                  className="order-form-input"
                  value={customerPhone}
                  aria-invalid={hasFormError && !customerPhone.trim()}
                  aria-describedby={hasFormError ? detailsErrorId : undefined}
                  onChange={(event) => {
                    onCustomerPhoneChange(event.target.value);
                  }}
                  disabled={isSubmittingOrder}
                  autoComplete="tel"
                  dir="ltr"
                />
              </label>

              <label className="order-form-field" htmlFor="order-notes">
                <span className="order-form-label">{t.orderNotes}</span>
                <textarea
                  id="order-notes"
                  className="order-form-input order-form-textarea"
                  value={orderNotes}
                  onChange={(event) => onOrderNotesChange(event.target.value)}
                  disabled={isSubmittingOrder}
                  rows={3}
                />
              </label>
            </div>

            {orderFormError && (
              <p id={detailsErrorId} className="order-form-error" role="alert">
                {orderFormError}
              </p>
            )}

            <p className="customer-seasonal-note customer-seasonal-note-modal">
              <span className="customer-seasonal-note-mark" aria-hidden="true" />
              {t.seasonalFlowersNote}
            </p>

            <div className="order-modal-actions">
              <button
                type="button"
                className="order-btn"
                onClick={onSubmitOrder}
                disabled={isSubmittingOrder}
              >
                {isSubmittingOrder ? t.submittingOrder : t.submitOrder}
              </button>
              <button
                type="button"
                className="order-btn-secondary"
                onClick={onBackToDate}
                disabled={isSubmittingOrder}
              >
                {t.backToDate}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
