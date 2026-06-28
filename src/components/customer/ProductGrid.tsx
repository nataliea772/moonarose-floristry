"use client";

import { type ProductCategory } from "@/data/products";
import { BackToCategoriesButton } from "@/components/customer/BackToCategoriesButton";
import { CategoryEmptyState } from "@/components/customer/CategoryEmptyState";
import { ProductCard } from "@/components/customer/ProductCard";
import { type CustomerProduct } from "@/components/customer/types";
import { type ProductReview } from "@/lib/reviews";
import { getTranslations, type Language } from "@/lib/translations";

type CustomerTranslations = ReturnType<typeof getTranslations>;

type ProductGridProps = {
  isLoading: boolean;
  loadError: string;
  selectedCategory: ProductCategory | null;
  productRevealKey: string | null;
  products: CustomerProduct[];
  language: Language;
  translations: CustomerTranslations;
  reviewsByProductId: Map<string, ProductReview[]>;
  customOrderWhatsAppHref: string;
  onBackToCategories: () => void;
  onOpenGallery: (product: CustomerProduct, index?: number) => void;
  onOpenOrder: (product: CustomerProduct) => void;
};

export function ProductGrid({
  isLoading,
  loadError,
  selectedCategory,
  productRevealKey,
  products,
  language,
  translations: t,
  reviewsByProductId,
  customOrderWhatsAppHref,
  onBackToCategories,
  onOpenGallery,
  onOpenOrder,
}: ProductGridProps) {
  return (
    <section className="products-section">
      {isLoading ? (
        <p className="text-center text-base text-[#755d56] sm:text-lg">
          {t.loadingCollection}
        </p>
      ) : !selectedCategory ? (
        loadError ? (
          <p className="text-center text-base text-[#9f5f5f] sm:text-lg">
            {loadError}
          </p>
        ) : (
          <p className="choose-category-prompt">{t.chooseCategoryPrompt}</p>
        )
      ) : (
        <>
          {loadError && (
            <p className="mb-4 text-center text-base text-[#9f5f5f] sm:mb-6 sm:text-lg">
              {loadError}
            </p>
          )}

          {products.length === 0 ? (
            <CategoryEmptyState
              translations={t}
              whatsappHref={customOrderWhatsAppHref}
              onBackToCategories={onBackToCategories}
            />
          ) : (
            <div className="category-results-panel">
              <BackToCategoriesButton
                translations={t}
                onClick={onBackToCategories}
              />

              <div
                key={productRevealKey ?? "products"}
                className="product-grid product-grid-animate"
              >
                {products.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    language={language}
                    translations={t}
                    reviews={reviewsByProductId.get(product.id) ?? []}
                    onOpenGallery={onOpenGallery}
                    onOpenOrder={onOpenOrder}
                  />
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </section>
  );
}
