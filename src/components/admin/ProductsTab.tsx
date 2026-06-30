"use client";

import {
  categoryHasSubcategories,
  getSubcategoriesForCategory,
  type ProductCategory,
} from "@/data/categories";
import { ProductImage } from "@/components/ProductImage";
import { hasProductLanguageTranslation } from "@/lib/productTranslations";
import { type ProductImageRecord } from "@/lib/productImages";
import { productCategories } from "@/components/admin/constants";
import {
  DeleteActionButton,
  EditActionButton,
  FormField,
  inputClassName,
  PrimaryActionButton,
} from "@/components/admin/AdminUI";
import {
  getAdminProductHebrewDescription,
  getAdminProductHebrewName,
} from "@/components/admin/utils";
import {
  type AdminProduct,
  type PendingImagePreview,
  type ProductFormState,
} from "@/components/admin/types";

type ProductsTabProps = {
  categoryProducts: AdminProduct[];
  selectedCategory: ProductCategory;
  onSelectCategory: (category: ProductCategory) => void;
  showProductForm: boolean;
  editingProductId: string | null;
  productForm: ProductFormState;
  onProductFormChange: (
    updater: (previous: ProductFormState) => ProductFormState
  ) => void;
  visibleExistingImages: ProductImageRecord[];
  pendingImagePreviews: PendingImagePreview[];
  formError: string;
  isSavingProduct: boolean;
  isLoadingProducts: boolean;
  productsError: string;
  onOpenProductForm: () => void;
  onCloseProductForm: () => void;
  onSaveProduct: () => void;
  onImageUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onRemovePendingImage: (previewId: string) => void;
  onRemoveExistingImage: (imageId: string) => void;
  onEditProduct: (product: AdminProduct) => void;
  onDeleteProduct: (productId: string) => void;
};

export function ProductsTab({
  categoryProducts,
  selectedCategory,
  onSelectCategory,
  showProductForm,
  editingProductId,
  productForm,
  onProductFormChange,
  visibleExistingImages,
  pendingImagePreviews,
  formError,
  isSavingProduct,
  isLoadingProducts,
  productsError,
  onOpenProductForm,
  onCloseProductForm,
  onSaveProduct,
  onImageUpload,
  onRemovePendingImage,
  onRemoveExistingImage,
  onEditProduct,
  onDeleteProduct,
}: ProductsTabProps) {
  return (
    <section className="admin-panel">
      <div className="admin-section-header">
        <div>
          <h2 className="admin-section-title">מוצרים</h2>
          <p className="admin-section-desc">ניהול מוצרים לפי קטגוריה</p>
        </div>

        <PrimaryActionButton onClick={onOpenProductForm}>
          + הוספת מוצר חדש
        </PrimaryActionButton>
      </div>

      {showProductForm && (
        <div className="admin-form-panel">
          <h3 className="admin-form-title">
            {editingProductId !== null ? "עריכת מוצר" : "הוספת מוצר חדש"}
          </h3>

          <div className="admin-form-grid">
            <FormField label="שם מוצר בעברית">
              <input
                type="text"
                className={inputClassName}
                value={productForm.name}
                onChange={(event) =>
                  onProductFormChange((previous) => ({
                    ...previous,
                    name: event.target.value,
                  }))
                }
              />
            </FormField>

            <FormField label="קטגוריה">
              <select
                className={inputClassName}
                value={productForm.category}
                onChange={(event) => {
                  const nextCategory = event.target.value as ProductCategory;

                  onProductFormChange((previous) => ({
                    ...previous,
                    category: nextCategory,
                    subcategory: "",
                  }));
                }}
              >
                {productCategories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </FormField>

            {categoryHasSubcategories(productForm.category) && (
              <FormField label="תת-קטגוריה">
                <select
                  className={inputClassName}
                  value={productForm.subcategory}
                  onChange={(event) =>
                    onProductFormChange((previous) => ({
                      ...previous,
                      subcategory: event.target.value,
                    }))
                  }
                >
                  <option value="">בחרי תת-קטגוריה</option>
                  {getSubcategoriesForCategory(productForm.category).map(
                    (subcategory) => (
                      <option key={subcategory} value={subcategory}>
                        {subcategory}
                      </option>
                    )
                  )}
                </select>
              </FormField>
            )}

            <FormField label="תיאור בעברית" className="admin-form-grid-span-2">
              <textarea
                className={`${inputClassName} admin-textarea`}
                value={productForm.description}
                onChange={(event) =>
                  onProductFormChange((previous) => ({
                    ...previous,
                    description: event.target.value,
                  }))
                }
              />
            </FormField>

            <div className="admin-form-grid-span-2 admin-form-translations">
              <h4 className="admin-form-subtitle">תרגומים</h4>
              <div className="admin-form-grid">
                <FormField label="שם מוצר בערבית">
                  <input
                    type="text"
                    className={inputClassName}
                    value={productForm.nameAr}
                    onChange={(event) =>
                      onProductFormChange((previous) => ({
                        ...previous,
                        nameAr: event.target.value,
                      }))
                    }
                    dir="rtl"
                  />
                </FormField>

                <FormField label="Product name in English">
                  <input
                    type="text"
                    className={inputClassName}
                    value={productForm.nameEn}
                    onChange={(event) =>
                      onProductFormChange((previous) => ({
                        ...previous,
                        nameEn: event.target.value,
                      }))
                    }
                    dir="ltr"
                  />
                </FormField>

                <FormField label="תיאור בערבית" className="admin-form-grid-span-2">
                  <textarea
                    className={`${inputClassName} admin-textarea`}
                    value={productForm.descriptionAr}
                    onChange={(event) =>
                      onProductFormChange((previous) => ({
                        ...previous,
                        descriptionAr: event.target.value,
                      }))
                    }
                    dir="rtl"
                  />
                </FormField>

                <FormField
                  label="Description in English"
                  className="admin-form-grid-span-2"
                >
                  <textarea
                    className={`${inputClassName} admin-textarea`}
                    value={productForm.descriptionEn}
                    onChange={(event) =>
                      onProductFormChange((previous) => ({
                        ...previous,
                        descriptionEn: event.target.value,
                      }))
                    }
                    dir="ltr"
                  />
                </FormField>
              </div>
            </div>

            <FormField label="מחיר">
              <input
                type="number"
                min="1"
                className={inputClassName}
                value={productForm.price}
                onChange={(event) =>
                  onProductFormChange((previous) => ({
                    ...previous,
                    price: event.target.value,
                  }))
                }
              />
            </FormField>

            <FormField label="זמן הכנה בימים">
              <input
                type="number"
                min="0"
                className={inputClassName}
                value={productForm.preparationDays}
                onChange={(event) =>
                  onProductFormChange((previous) => ({
                    ...previous,
                    preparationDays: event.target.value,
                  }))
                }
              />
            </FormField>

            <FormField label="Top Seller">
              <label className="admin-checkbox-field">
                <input
                  type="checkbox"
                  className="admin-checkbox-input"
                  checked={productForm.isTopSeller}
                  onChange={(event) =>
                    onProductFormChange((previous) => ({
                      ...previous,
                      isTopSeller: event.target.checked,
                    }))
                  }
                />
                <span>Top Seller</span>
              </label>
            </FormField>

            <FormField label="תמונות מוצר" className="admin-form-grid-span-2">
              <input
                type="file"
                accept="image/*"
                multiple
                className={`${inputClassName} admin-file-input`}
                onChange={onImageUpload}
              />
              {(visibleExistingImages.length > 0 ||
                pendingImagePreviews.length > 0) && (
                <div className="admin-image-grid">
                  {visibleExistingImages.map((image) => (
                    <div key={image.id} className="admin-image-preview">
                      <img src={image.imageUrl} alt="תמונת מוצר קיימת" />
                      <button
                        type="button"
                        className="admin-image-remove"
                        onClick={() => onRemoveExistingImage(image.id)}
                      >
                        הסרה
                      </button>
                    </div>
                  ))}
                  {pendingImagePreviews.map((preview) => (
                    <div key={preview.id} className="admin-image-preview">
                      <img
                        src={preview.preview}
                        alt="תצוגה מקדימה של תמונה חדשה"
                      />
                      <button
                        type="button"
                        className="admin-image-remove"
                        onClick={() => onRemovePendingImage(preview.id)}
                      >
                        הסרה
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </FormField>
          </div>

          {formError && (
            <p className="admin-message-error mt-4">{formError}</p>
          )}

          <div className="admin-form-actions">
            <PrimaryActionButton
              onClick={onSaveProduct}
              disabled={isSavingProduct}
            >
              {isSavingProduct ? "שומרת..." : "שמירת מוצר"}
            </PrimaryActionButton>
            <button
              type="button"
              className="admin-btn-secondary"
              onClick={onCloseProductForm}
            >
              ביטול
            </button>
          </div>
        </div>
      )}

      <div className="admin-category-row">
        {productCategories.map((category) => {
          const isSelected = selectedCategory === category;

          return (
            <button
              key={category}
              type="button"
              className={`admin-category-chip ${
                isSelected ? "admin-category-chip-active" : ""
              }`}
              onClick={() => onSelectCategory(category)}
            >
              {category}
            </button>
          );
        })}
      </div>

      {isLoadingProducts ? (
        <p className="admin-message-muted">טוען מוצרים...</p>
      ) : productsError ? (
        <p className="admin-message-error">{productsError}</p>
      ) : categoryProducts.length === 0 ? (
        <p className="admin-message-muted">אין מוצרים בקטגוריה הזו כרגע</p>
      ) : (
        <div className="admin-product-list">
          {categoryProducts.map((product) => (
            <article key={product.id} className="admin-product-item">
              <div className="admin-product-thumb">
                <ProductImage
                  src={product.image}
                  alt={getAdminProductHebrewName(product)}
                  className="h-full w-full object-cover"
                  placeholderClassName="product-placeholder"
                />
                {product.images.length > 1 && (
                  <span className="admin-thumb-badge">
                    {product.images.length}
                  </span>
                )}
              </div>
              <div className="admin-product-body">
                <div className="admin-product-title-row">
                  <h4 className="admin-product-name">
                    {getAdminProductHebrewName(product)}
                  </h4>
                  {product.isTopSeller && (
                    <span className="admin-top-seller-badge">Top Seller</span>
                  )}
                </div>
                <p className="admin-product-meta">
                  {product.category}
                  {product.subcategory ? ` · ${product.subcategory}` : ""}
                </p>
                <p className="admin-product-desc">
                  {getAdminProductHebrewDescription(product)}
                </p>
                <div className="admin-product-translations">
                  <span>
                    תרגום לערבית:{" "}
                    {hasProductLanguageTranslation(product, "ar")
                      ? "קיים"
                      : "חסר"}
                  </span>
                  <span>
                    תרגום לאנגלית:{" "}
                    {hasProductLanguageTranslation(product, "en")
                      ? "קיים"
                      : "חסר"}
                  </span>
                </div>
                <div className="admin-product-stats">
                  <span className="admin-product-price">₪{product.price}</span>
                  <span className="text-[#755d56]">
                    {product.preparationDays} ימי הכנה
                  </span>
                </div>
                <div className="admin-product-actions">
                  <EditActionButton onClick={() => onEditProduct(product)} />
                  <DeleteActionButton
                    onClick={() => onDeleteProduct(product.id)}
                  />
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
