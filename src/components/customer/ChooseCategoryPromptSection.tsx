"use client";

import { getTranslations } from "@/lib/translations";

type CustomerTranslations = ReturnType<typeof getTranslations>;

type ChooseCategoryPromptSectionProps = {
  translations: CustomerTranslations;
};

export function ChooseCategoryPromptSection({
  translations: t,
}: ChooseCategoryPromptSectionProps) {
  return (
    <section
      className="customer-choose-category-prompt"
      aria-label={t.chooseCategoryPrompt}
    >
      <div className="customer-choose-category-prompt-divider" aria-hidden="true">
        <span className="customer-choose-category-prompt-line" />
        <span className="customer-choose-category-prompt-flower">✿</span>
        <span className="customer-choose-category-prompt-line" />
      </div>
      <p className="customer-choose-category-prompt-text">
        {t.chooseCategoryPrompt}
      </p>
      <span className="customer-choose-category-prompt-heart" aria-hidden="true">
        ♥
      </span>
    </section>
  );
}
