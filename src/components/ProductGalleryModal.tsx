"use client";

import { useEffect } from "react";
import { ProductImage } from "@/components/ProductImage";

export type GalleryLabels = {
  close: string;
  closeGallery: string;
  nextImage: string;
  previousImage: string;
  galleryTitle: (name: string) => string;
  imageAlt: (name: string, index: number) => string;
};

type ProductGalleryModalProps = {
  productName: string;
  images: string[];
  currentIndex: number;
  onClose: () => void;
  onPrevious: () => void;
  onNext: () => void;
  labels: GalleryLabels;
};

export function ProductGalleryModal({
  productName,
  images,
  currentIndex,
  onClose,
  onPrevious,
  onNext,
  labels,
}: ProductGalleryModalProps) {
  const hasMultiple = images.length > 1;
  const currentImage = images[currentIndex] ?? "";

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }

      if (event.key === "ArrowRight" && hasMultiple) {
        onPrevious();
      }

      if (event.key === "ArrowLeft" && hasMultiple) {
        onNext();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [hasMultiple, onClose, onNext, onPrevious]);

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center p-3 sm:p-5"
      role="dialog"
      aria-modal="true"
      aria-label={labels.galleryTitle(productName)}
    >
      <button
        type="button"
        className="order-modal-backdrop absolute inset-0"
        aria-label={labels.closeGallery}
        onClick={onClose}
      />

      <div className="gallery-modal-card relative flex w-full max-w-3xl flex-col overflow-hidden">
        <div className="flex items-center justify-between gap-3 border-b border-[#ecd1c8]/80 px-4 py-3.5 sm:px-5">
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-[#3b2521]">
              {productName}
            </p>
            {hasMultiple && (
              <p className="text-xs text-[#755d56]">
                {currentIndex + 1} / {images.length}
              </p>
            )}
          </div>
          <button
            type="button"
            className="contact-btn min-h-11 shrink-0 px-5 py-2.5 text-sm"
            onClick={onClose}
          >
            {labels.close}
          </button>
        </div>

        <div className="relative flex min-h-[240px] items-center justify-center bg-gradient-to-b from-[#fceeea]/50 to-[#fff8f5] p-3 sm:min-h-[360px] sm:p-6">
          <div className="aspect-[4/5] w-full max-w-md overflow-hidden rounded-[1.35rem] border border-[#ecd1c8]/90 bg-white shadow-[inset_0_0_0_1px_rgba(255,255,255,0.6)] sm:aspect-[3/4]">
            <ProductImage
              src={currentImage}
              alt={labels.imageAlt(productName, currentIndex + 1)}
              className="h-full w-full object-cover"
              placeholderClassName="product-placeholder"
            />
          </div>

          {hasMultiple && (
            <>
              <button
                type="button"
                className="gallery-nav-btn absolute top-1/2 right-2 -translate-y-1/2 sm:right-5 sm:h-12 sm:w-12"
                aria-label={labels.nextImage}
                onClick={onNext}
              >
                ›
              </button>
              <button
                type="button"
                className="gallery-nav-btn absolute top-1/2 left-2 -translate-y-1/2 sm:left-5 sm:h-12 sm:w-12"
                aria-label={labels.previousImage}
                onClick={onPrevious}
              >
                ‹
              </button>
            </>
          )}
        </div>

        {hasMultiple && (
          <div className="flex justify-center gap-2 px-4 py-4">
            {images.map((_, index) => (
              <span
                key={index}
                className={`gallery-dot ${
                  index === currentIndex
                    ? "gallery-dot-active"
                    : "gallery-dot-inactive"
                }`}
                aria-hidden="true"
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
