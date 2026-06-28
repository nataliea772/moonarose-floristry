export type ProductReview = {
  id: string;
  productId: string;
  customerName: string;
  rating: number;
  comment: string | null;
  createdAt: string;
};

export type ProductReviewSummary = {
  averageRating: number;
  count: number;
};

export function groupReviewsByProductId(
  reviews: ProductReview[]
): Map<string, ProductReview[]> {
  const grouped = new Map<string, ProductReview[]>();

  for (const review of reviews) {
    const existing = grouped.get(review.productId) ?? [];
    existing.push(review);
    grouped.set(review.productId, existing);
  }

  return grouped;
}

export function getProductReviewSummary(
  reviews: ProductReview[]
): ProductReviewSummary | null {
  if (reviews.length === 0) {
    return null;
  }

  const total = reviews.reduce((sum, review) => sum + review.rating, 0);

  return {
    averageRating: total / reviews.length,
    count: reviews.length,
  };
}

export function formatAverageRating(value: number): string {
  return value.toFixed(1);
}

export function formatReviewCountLabel(count: number): string {
  return count === 1 ? "דירוג אחד" : `${count} דירוגים`;
}

export function renderStarRating(rating: number): string {
  const safeRating = Math.max(1, Math.min(5, Math.round(rating)));
  return "★".repeat(safeRating);
}

export function buildReviewPagePath(orderId: string, productId: string): string {
  const params = new URLSearchParams({
    orderId,
    productId,
  });

  return `/review?${params.toString()}`;
}

export function buildReviewPageUrl(
  origin: string,
  orderId: string,
  productId: string
): string {
  return `${origin.replace(/\/$/, "")}${buildReviewPagePath(orderId, productId)}`;
}
