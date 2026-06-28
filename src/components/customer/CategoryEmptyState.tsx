"use client";

import { WhatsAppIcon } from "@/components/ContactIcons";
import { BackToCategoriesButton } from "@/components/customer/BackToCategoriesButton";
import { getTranslations } from "@/lib/translations";

type CustomerTranslations = ReturnType<typeof getTranslations>;

type CategoryEmptyStateProps = {
  translations: CustomerTranslations;
  whatsappHref: string;
  onBackToCategories: () => void;
};

export function CategoryEmptyState({
  translations: t,
  whatsappHref,
  onBackToCategories,
}: CategoryEmptyStateProps) {
  return (
    <div className="category-empty-panel">
      <BackToCategoriesButton
        translations={t}
        onClick={onBackToCategories}
      />

      <article className="category-empty-state" aria-live="polite">
        <div className="category-empty-state-inner">
          <span className="category-empty-state-label">{t.categoryEmptyLabel}</span>

          <div className="category-empty-state-mark" aria-hidden="true">
            <span className="category-empty-state-mark-dot" />
            <span className="category-empty-state-mark-line" />
          </div>

          <h3 className="category-empty-state-title">{t.categoryEmptyTitle}</h3>
          <p className="category-empty-state-text">{t.categoryEmptyText}</p>

          {whatsappHref && (
            <a
              href={whatsappHref}
              className="category-empty-state-whatsapp"
              target="_blank"
              rel="noopener noreferrer"
            >
              <WhatsAppIcon className="category-empty-state-whatsapp-icon" />
              {t.categoryEmptyWhatsApp}
            </a>
          )}
        </div>
      </article>
    </div>
  );
}
