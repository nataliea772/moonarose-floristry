"use client";

import { useRef } from "react";
import { type ProductCategory } from "@/data/products";
import { CategoryEmptyState } from "@/components/customer/CategoryEmptyState";
import { ProductCard } from "@/components/customer/ProductCard";
import { type CustomerProduct } from "@/components/customer/types";
import { type ProductReview } from "@/lib/reviews";
import {
  getCategoryLabel,
  getTranslations,
  type Language,
} from "@/lib/translations";

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
  const carouselRef = useRef<HTMLDivElement>(null);

  const scrollCarousel = (direction: "prev" | "next") => {
    const container = carouselRef.current;
    if (!container) {
      return;
    }

    const items = Array.from(
      container.querySelectorAll<HTMLElement>(".customer-products-carousel-item")
    );

    if (items.length === 0) {
      return;
    }

    const containerRect = container.getBoundingClientRect();
    const containerCenter = containerRect.left + containerRect.width / 2;

    let activeIndex = 0;
    items.forEach((item, index) => {
      const rect = item.getBoundingClientRect();
      const itemCenter = rect.left + rect.width / 2;
      if (Math.abs(itemCenter - containerCenter) < rect.width / 2) {
        activeIndex = index;
      }
    });

    const nextIndex =
      direction === "next"
        ? Math.min(activeIndex + 1, items.length - 1)
        : Math.max(activeIndex - 1, 0);

    items[nextIndex]?.scrollIntoView({
      behavior: "smooth",
      inline: "start",
      block: "nearest",
    });
  };

  if (isLoading) {
    if (!selectedCategory) {
      return loadError ? (
        <section className="products-section">
          <p className="text-center text-base text-[#9f5f5f] sm:text-lg">
            {loadError}
          </p>
        </section>
      ) : null;
    }

    return (
      <section
        id="customer-products-section"
        className="products-section customer-products-section"
      >
        <p className="text-center text-base text-[#755d56] sm:text-lg">
          {t.loadingCollection}
        </p>
      </section>
    );
  }

  if (!selectedCategory) {
    return loadError ? (
      <section className="products-section">
        <p className="text-center text-base text-[#9f5f5f] sm:text-lg">
          {loadError}
        </p>
      </section>
    ) : null;
  }

  return (
    <section
      id="customer-products-section"
      className="products-section customer-products-section"
    >
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
        <div
          key={productRevealKey ?? "products"}
          className="customer-products-carousel-panel"
        >
          <div className="customer-products-carousel-header">
            <h2 className="customer-products-carousel-title">
              {getCategoryLabel(selectedCategory, language)}
            </h2>
            <button
              type="button"
              className="customer-products-carousel-view-all"
              onClick={onBackToCategories}
            >
              {t.viewAllProducts}
            </button>
          </div>

          <div className="customer-products-carousel-shell">
            <button
              type="button"
              className="customer-products-carousel-arrow customer-products-carousel-arrow-prev"
              onClick={() => scrollCarousel("prev")}
              aria-label={t.carouselPrevious}
            >
              ‹
            </button>

            <div
              ref={carouselRef}
              className="customer-products-carousel product-grid-animate"
            >
              {products.map((product) => (
                <div
                  key={product.id}
                  className="customer-products-carousel-item"
                >
                  <ProductCard
                    product={product}
                    language={language}
                    translations={t}
                    reviews={reviewsByProductId.get(product.id) ?? []}
                    onOpenGallery={onOpenGallery}
                    onOpenOrder={onOpenOrder}
                  />
                </div>
              ))}
            </div>

            <button
              type="button"
              className="customer-products-carousel-arrow customer-products-carousel-arrow-next"
              onClick={() => scrollCarousel("next")}
              aria-label={t.carouselNext}
            >
              ›
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
