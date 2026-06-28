"use client";

import { type ProductCategory } from "@/data/products";
import {
  getCategoryDescription,
  getCategoryLabel,
  type Language,
} from "@/lib/translations";
import { productCategoriesList } from "@/components/customer/utils";

type CategorySelectorProps = {
  selectedCategory: ProductCategory;
  language: Language;
  onSelectCategory: (category: ProductCategory) => void;
};

export function CategorySelector({
  selectedCategory,
  language,
  onSelectCategory,
}: CategorySelectorProps) {
  return (
    <section className="category-grid mb-14 sm:mb-16">
      {productCategoriesList.map((category) => {
        const isSelected = selectedCategory === category;

        return (
          <button
            key={category}
            type="button"
            className={`category-card ${isSelected ? "category-card-selected" : ""}`}
            onClick={() => onSelectCategory(category)}
          >
            <h2 className="category-card-title">
              {getCategoryLabel(category, language)}
            </h2>
            <p className="category-card-desc">
              {getCategoryDescription(category, language)}
            </p>
          </button>
        );
      })}
    </section>
  );
}
