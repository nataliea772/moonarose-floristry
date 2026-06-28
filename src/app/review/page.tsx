"use client";

import Link from "next/link";
import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import { BRAND_NAME } from "@/lib/brand";

function ReviewPageContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId")?.trim() ?? "";
  const productId = searchParams.get("productId")?.trim() ?? "";

  const [productName, setProductName] = useState("");
  const [isLoadingProduct, setIsLoadingProduct] = useState(false);
  const [rating, setRating] = useState<number | null>(null);
  const [customerName, setCustomerName] = useState("");
  const [comment, setComment] = useState("");
  const [formError, setFormError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const hasValidLink = Boolean(orderId && productId);

  useEffect(() => {
    if (!productId) {
      setProductName("");
      return;
    }

    async function loadProduct() {
      setIsLoadingProduct(true);

      const { data, error } = await supabase
        .from("products")
        .select("name")
        .eq("id", productId)
        .maybeSingle();

      if (error) {
        console.error(error);
        setProductName("");
      } else {
        setProductName(data?.name ?? "");
      }

      setIsLoadingProduct(false);
    }

    loadProduct();
  }, [productId]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFormError("");

    if (!orderId || !productId) {
      setFormError("קישור הדירוג אינו תקין");
      return;
    }

    if (rating === null) {
      setFormError("נא לבחור דירוג");
      return;
    }

    if (!customerName.trim()) {
      setFormError("נא למלא שם");
      return;
    }

    setIsSubmitting(true);

    try {
      const { error } = await supabase.from("reviews").insert({
        product_id: productId,
        order_id: orderId,
        customer_name: customerName.trim(),
        rating,
        comment: comment.trim() || null,
        is_visible: true,
      });

      if (error) {
        throw error;
      }

      setIsSuccess(true);
    } catch (error) {
      console.error(error);
      setFormError("לא הצלחנו לשלוח את הדירוג כרגע");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="review-page text-[#2f1f1b]" dir="rtl">
      <div className="review-page-shell">
        <header className="review-page-header">
          <p className="review-page-eyebrow">{BRAND_NAME.toUpperCase()}</p>
          <h1 className="brand-title review-page-title">דירוג החוויה שלך</h1>
          <p className="review-page-subtitle">
            נשמח לשמוע איך הייתה החוויה שלך עם {BRAND_NAME}
          </p>
        </header>

        {!hasValidLink ? (
          <div className="review-page-card">
            <p className="review-page-error">קישור הדירוג אינו תקין</p>
            <Link href="/" className="review-page-link">
              חזרה לדף הבית
            </Link>
          </div>
        ) : isSuccess ? (
          <div className="review-page-card review-page-success">
            <div className="review-success-icon" aria-hidden="true">
              ✓
            </div>
            <p className="review-success-message">
              תודה רבה! הדירוג שלך נשלח בהצלחה
            </p>
            <Link href="/" className="review-page-link">
              חזרה לדף הבית
            </Link>
          </div>
        ) : (
          <form className="review-page-card" onSubmit={handleSubmit}>
            {productId && (
              <div className="review-product-box">
                <span className="review-form-label">מוצר</span>
                <p className="review-product-name">
                  {isLoadingProduct
                    ? "טוען..."
                    : productName || "מוצר מההזמנה שלך"}
                </p>
              </div>
            )}

            <fieldset className="review-rating-field">
              <legend className="review-form-label">דירוג</legend>
              <div className="review-rating-row">
                {[1, 2, 3, 4, 5].map((value) => {
                  const isSelected = rating !== null && value <= rating;

                  return (
                    <button
                      key={value}
                      type="button"
                      className={`review-star-btn ${
                        isSelected ? "review-star-btn-selected" : ""
                      }`}
                      onClick={() => {
                        setRating(value);
                        setFormError("");
                      }}
                      aria-label={`${value} כוכבים`}
                    >
                      ★
                    </button>
                  );
                })}
              </div>
              {rating !== null && (
                <p className="review-rating-label">{rating} מתוך 5</p>
              )}
            </fieldset>

            <label className="review-form-field">
              <span className="review-form-label">שם</span>
              <input
                type="text"
                className="review-form-input"
                value={customerName}
                onChange={(event) => {
                  setCustomerName(event.target.value);
                  setFormError("");
                }}
                autoComplete="name"
              />
            </label>

            <label className="review-form-field">
              <span className="review-form-label">תגובה (אופציונלי)</span>
              <textarea
                className="review-form-input review-form-textarea"
                value={comment}
                onChange={(event) => setComment(event.target.value)}
                rows={4}
              />
            </label>

            {formError && <p className="review-page-error">{formError}</p>}

            <button
              type="submit"
              className="review-submit-btn"
              disabled={isSubmitting}
            >
              {isSubmitting ? "שולחת דירוג..." : "שליחת דירוג"}
            </button>
          </form>
        )}
      </div>
    </main>
  );
}

function ReviewPageFallback() {
  return (
    <main className="review-page text-[#2f1f1b]" dir="rtl">
      <div className="review-page-shell">
        <p className="review-page-loading">טוען...</p>
      </div>
    </main>
  );
}

export default function ReviewPage() {
  return (
    <Suspense fallback={<ReviewPageFallback />}>
      <ReviewPageContent />
    </Suspense>
  );
}
