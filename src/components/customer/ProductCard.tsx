"use client";

import { ProductImage } from "@/components/ProductImage";
import { ReviewPreview } from "@/components/customer/ReviewPreview";
import { type CustomerProduct } from "@/components/customer/types";
import {
  getLocalizedProductDescription,
  getLocalizedProductName,
} from "@/lib/productTranslations";
import { type ProductReview } from "@/lib/reviews";
import { getCategoryLabel, getTranslations, type Language } from "@/lib/translations";

type CustomerTranslations = ReturnType<typeof getTranslations>;

type ProductCardProps = {
  product: CustomerProduct;
  language: Language;
  translations: CustomerTranslations;
  reviews: ProductReview[];
  onOpenGallery: (product: CustomerProduct, index?: number) => void;
  onOpenOrder: (product: CustomerProduct) => void;
};

export function ProductCard({
  product,
  language,
  translations: t,
  reviews,
  onOpenGallery,
  onOpenOrder,
}: ProductCardProps) {
  const displayName = getLocalizedProductName(product, language);
  const displayDescription = getLocalizedProductDescription(product, language);

  return (
    <article className="product-card">
      {product.isTopSeller && (
        <span className="product-top-seller-badge">Top Seller</span>
      )}

      {product.images.length > 0 ? (
        <button
          type="button"
          className="product-image-frame product-image-frame-button"
          onClick={() => onOpenGallery(product, 0)}
          aria-label={t.openGalleryAria(displayName)}
        >
          <ProductImage
            src={product.image}
            alt={displayName}
            className="h-full w-full object-cover"
          />
          {product.images.length > 1 && (
            <span className="product-image-count">
              1 / {product.images.length}
            </span>
          )}
        </button>
      ) : (
        <div className="product-image-frame">
          <ProductImage
            src={product.image}
            alt={displayName}
            className="h-full w-full object-cover"
          />
        </div>
      )}

      <p className="product-category-label">
        {getCategoryLabel(product.category, language)}
      </p>

      <h3 className="product-name">{displayName}</h3>

      <p className="product-description">{displayDescription}</p>

      <ReviewPreview reviews={reviews} translations={t} />

      <p className="product-price">₪{product.price}</p>

      <button
        type="button"
        className="order-btn"
        onClick={() => onOpenOrder(product)}
        aria-label={t.orderButtonAria(displayName)}
      >
        {t.orderButton}
      </button>
    </article>
  );
}
