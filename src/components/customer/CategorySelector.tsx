"use client";

import {
  PRODUCT_CATEGORIES,
  type ProductCategory,
} from "@/data/categories";
import { getCategoryLabel, getTranslations, type Language } from "@/lib/translations";

type CategorySelectorProps = {
  selectedCategory: ProductCategory | null;
  language: Language;
  onSelectCategory: (category: ProductCategory) => void;
};

export function CategorySelector({
  selectedCategory,
  language,
  onSelectCategory,
}: CategorySelectorProps) {
  const t = getTranslations(language);

  return (
    <section
      id="category-selector"
      className="category-selector customer-category-pills"
      aria-label={t.categoriesAriaLabel}
    >      {PRODUCT_CATEGORIES.map((category) => {
        const isSelected = selectedCategory === category;

        return (
          <button
            key={category}
            type="button"
            className={`category-pill ${isSelected ? "category-pill-selected" : ""}`}
            onClick={() => onSelectCategory(category)}
            aria-pressed={isSelected}
          >
            {getCategoryLabel(category, language)}
          </button>
        );
      })}
    </section>
  );
}
