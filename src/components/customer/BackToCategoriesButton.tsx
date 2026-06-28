"use client";

import { getTranslations } from "@/lib/translations";

type CustomerTranslations = ReturnType<typeof getTranslations>;

type BackToCategoriesButtonProps = {
  translations: CustomerTranslations;
  onClick: () => void;
};

export function BackToCategoriesButton({
  translations: t,
  onClick,
}: BackToCategoriesButtonProps) {
  return (
    <button
      type="button"
      className="back-to-categories-btn"
      onClick={onClick}
    >
      <span className="back-to-categories-icon" aria-hidden="true">
        ‹
      </span>
      {t.backToCategories}
    </button>
  );
}
