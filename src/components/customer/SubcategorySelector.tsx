"use client";

import {
  getSubcategoriesForCategory,
  SUBCATEGORY_FILTER_ALL,
  type ProductCategory,
  type SubcategoryFilter,
} from "@/data/categories";
import {
  getSubcategoryLabel,
  getTranslations,
  type Language,
} from "@/lib/translations";

type CustomerTranslations = ReturnType<typeof getTranslations>;

type SubcategorySelectorProps = {
  category: ProductCategory;
  selectedSubcategory: SubcategoryFilter;
  language: Language;
  translations: CustomerTranslations;
  onSelectSubcategory: (subcategory: SubcategoryFilter) => void;
};

export function SubcategorySelector({
  category,
  selectedSubcategory,
  language,
  translations: t,
  onSelectSubcategory,
}: SubcategorySelectorProps) {
  const subcategories = getSubcategoriesForCategory(category);

  return (
    <section className="subcategory-selector mb-4 sm:mb-8">
      <button
        type="button"
        className={`subcategory-chip ${
          selectedSubcategory === SUBCATEGORY_FILTER_ALL
            ? "subcategory-chip-selected"
            : ""
        }`}
        onClick={() => onSelectSubcategory(SUBCATEGORY_FILTER_ALL)}
        aria-pressed={selectedSubcategory === SUBCATEGORY_FILTER_ALL}
      >
        {t.subcategoryAll}
      </button>

      {subcategories.map((subcategory) => {
        const isSelected = selectedSubcategory === subcategory;

        return (
          <button
            key={subcategory}
            type="button"
            className={`subcategory-chip ${
              isSelected ? "subcategory-chip-selected" : ""
            }`}
            onClick={() => onSelectSubcategory(subcategory)}
            aria-pressed={isSelected}
          >
            {getSubcategoryLabel(subcategory, language)}
          </button>
        );
      })}
    </section>
  );
}
