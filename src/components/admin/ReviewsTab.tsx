"use client";

import { PrimaryActionButton } from "@/components/admin/AdminUI";
import {
  formatReviewTimestamp,
  renderReviewStars,
} from "@/components/admin/utils";
import { type AdminReview } from "@/components/admin/types";

type ReviewsTabProps = {
  isLoadingReviews: boolean;
  reviewsError: string;
  reviewActionMessage: string;
  reviews: AdminReview[];
  updatingReviewId: string | null;
  deletingReviewId: string | null;
  onFetchReviews: () => void;
  onToggleReviewVisibility: (review: AdminReview) => void;
  onDeleteReview: (reviewId: string) => void;
};

export function ReviewsTab({
  isLoadingReviews,
  reviewsError,
  reviewActionMessage,
  reviews,
  updatingReviewId,
  deletingReviewId,
  onFetchReviews,
  onToggleReviewVisibility,
  onDeleteReview,
}: ReviewsTabProps) {
  return (
    <section className="admin-panel">
      <div className="admin-section-header">
        <div>
          <h2 className="admin-section-title">ביקורות</h2>
          <p className="admin-section-desc">ניהול דירוגים ותגובות מלקוחות</p>
        </div>

        <PrimaryActionButton onClick={onFetchReviews} disabled={isLoadingReviews}>
          רענון ביקורות
        </PrimaryActionButton>
      </div>

      {reviewActionMessage && (
        <p className="admin-message-success mb-4">{reviewActionMessage}</p>
      )}

      {reviewsError && (
        <p className="admin-message-error mb-4">{reviewsError}</p>
      )}

      {isLoadingReviews ? (
        <p className="admin-message-muted">טוען ביקורות...</p>
      ) : reviews.length === 0 ? (
        <p className="admin-message-muted">אין ביקורות כרגע</p>
      ) : (
        <div className="admin-review-list">
          {reviews.map((review) => (
            <article key={review.id} className="admin-review-item">
              <div className="admin-review-header">
                <div>
                  <h3 className="admin-review-name">{review.customerName}</h3>
                  {review.productName && (
                    <p className="admin-review-product">{review.productName}</p>
                  )}
                </div>
                <span
                  className={`admin-review-visibility ${
                    review.isVisible
                      ? "admin-review-visibility-visible"
                      : "admin-review-visibility-hidden"
                  }`}
                >
                  {review.isVisible ? "מוצג באתר" : "מוסתר מהאתר"}
                </span>
              </div>

              <div className="admin-review-rating">
                <span className="admin-review-stars" aria-hidden="true">
                  {renderReviewStars(review.rating)}
                </span>
                <span className="admin-review-rating-label">
                  {review.rating}/5
                </span>
              </div>

              {review.comment && (
                <p className="admin-review-comment">{review.comment}</p>
              )}

              <p className="admin-review-created">
                {formatReviewTimestamp(review.createdAt)}
              </p>

              <div className="admin-review-actions">
                <button
                  type="button"
                  className="admin-btn-edit"
                  onClick={() => onToggleReviewVisibility(review)}
                  disabled={
                    updatingReviewId === review.id ||
                    deletingReviewId === review.id
                  }
                >
                  {review.isVisible ? "הסתרה מהאתר" : "הצגה באתר"}
                </button>
                <button
                  type="button"
                  className="admin-btn-delete"
                  onClick={() => onDeleteReview(review.id)}
                  disabled={
                    updatingReviewId === review.id ||
                    deletingReviewId === review.id
                  }
                >
                  מחיקה
                </button>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
