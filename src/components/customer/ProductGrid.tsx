"use client";

import { type ProductCategory } from "@/data/products";
import { ProductCard } from "@/components/customer/ProductCard";
import { type CustomerProduct } from "@/components/customer/types";
import { type ProductReview } from "@/lib/reviews";
import { getTranslations, type Language } from "@/lib/translations";

type CustomerTranslations = ReturnType<typeof getTranslations>;

type ProductGridProps = {
  isLoading: boolean;
  loadError: string;
  selectedCategory: ProductCategory | null;
  products: CustomerProduct[];
  language: Language;
  translations: CustomerTranslations;
  reviewsByProductId: Map<string, ProductReview[]>;
  onOpenGallery: (product: CustomerProduct, index?: number) => void;
  onOpenOrder: (product: CustomerProduct) => void;
};

export function ProductGrid({
  isLoading,
  loadError,
  selectedCategory,
  products,
  language,
  translations: t,
  reviewsByProductId,
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
            <p className="text-center text-base text-[#755d56] sm:text-lg">
              {t.noProducts}
            </p>
          ) : (
            <div className="product-grid">
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
          )}
        </>
      )}
    </section>
  );
}
