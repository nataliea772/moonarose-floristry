"use client";

import {
  formatAverageRating,
  getProductReviewSummary,
  renderStarRating,
  type ProductReview,
} from "@/lib/reviews";
import { getTranslations } from "@/lib/translations";

type CustomerTranslations = ReturnType<typeof getTranslations>;

type ReviewPreviewProps = {
  reviews: ProductReview[];
  translations: CustomerTranslations;
};

export function ReviewPreview({ reviews, translations: t }: ReviewPreviewProps) {
  const reviewSummary = getProductReviewSummary(reviews);
  const reviewPreview = reviews.slice(0, 2);

  return (
    <>
      <div className="product-reviews-summary">
        {reviewSummary ? (
          <p className="product-rating-line">
            <span className="product-rating-star">★</span>{" "}
            {formatAverageRating(reviewSummary.averageRating)} (
            {t.reviewCount(reviewSummary.count)})
          </p>
        ) : (
          <p className="product-rating-empty">{t.noRatingsYet}</p>
        )}
      </div>

      {reviewPreview.length > 0 && (
        <div className="product-reviews-preview">
          {reviewPreview.map((review) => (
            <div key={review.id} className="product-review-item">
              <div className="product-review-item-header">
                <span className="product-review-name">{review.customerName}</span>
                <span
                  className="product-review-stars"
                  aria-label={t.ratingOutOfFive(review.rating)}
                >
                  {renderStarRating(review.rating)}
                </span>
              </div>
              {review.comment && (
                <p className="product-review-comment">{review.comment}</p>
              )}
            </div>
          ))}
        </div>
      )}
    </>
  );
}
