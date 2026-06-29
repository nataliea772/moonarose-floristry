"use client";

import { useEffect, useRef, useState } from "react";
import {
  categoryHasSubcategories,
  SUBCATEGORY_FILTER_ALL,
  type ProductCategory,
  type SubcategoryFilter,
} from "@/data/categories";
import {
  EMPTY_CONTACT_DETAILS,
  buildPhoneHref,
  buildWhatsAppHref,
  buildInstagramHref,
  buildFacebookHref,
  buildTikTokHref,
} from "@/lib/contactStorage";
import {
  DEFAULT_ORDER_SETTINGS,
  normalizeAvailableDatesCount,
} from "@/lib/orderSettingsStorage";
import { supabase } from "@/lib/supabaseClient";
import {
  getDateLocale,
  getCategoryLabel,
  getSubcategoryLabel,
  getTextDirection,
  getTranslations,
  isLanguage,
  LANGUAGE_STORAGE_KEY,
  type Language,
} from "@/lib/translations";
import { ProductGalleryModal } from "@/components/ProductGalleryModal";
import { CategorySelector } from "@/components/customer/CategorySelector";
import { SubcategorySelector } from "@/components/customer/SubcategorySelector";
import { CustomerHero } from "@/components/customer/CustomerHero";
import { LanguageSelect } from "@/components/customer/LanguageSelect";
import { OrderModal } from "@/components/customer/OrderModal";
import { ProductGrid } from "@/components/customer/ProductGrid";
import { ComingSoonVanCard } from "@/components/customer/ComingSoonVanCard";
import { HowItWorksSection } from "@/components/customer/HowItWorksSection";
import { ConsultationCard } from "@/components/customer/ConsultationCard";
import { ChooseCategoryPromptSection } from "@/components/customer/ChooseCategoryPromptSection";
import { type CustomerProduct } from "@/components/customer/types";
import {
  getAvailableDates,
  mapDefaultProducts,
  mapSupabaseProduct,
  mapSupabaseReview,
  parseDateFromKey,
  toClosedDateKey,
  type SupabaseClosedDateRow,
  type SupabaseContactRow,
  type SupabaseOrderSettingsRow,
  type SupabaseProductRow,
  type SupabaseReviewRow,
} from "@/components/customer/utils";
import {
  fetchAllProductImages,
  groupProductImagesByProductId,
} from "@/lib/productImages";
import { groupReviewsByProductId, type ProductReview } from "@/lib/reviews";
import {
  getLocalizedProductName,
  PRODUCT_SELECT_COLUMNS,
} from "@/lib/productTranslations";

export default function Home() {
  const [selectedCategory, setSelectedCategory] =
    useState<ProductCategory | null>(null);
  const [selectedSubcategory, setSelectedSubcategory] =
    useState<SubcategoryFilter>(SUBCATEGORY_FILTER_ALL);
  const [orderProduct, setOrderProduct] = useState<CustomerProduct | null>(
    null
  );
  const [selectedDateKey, setSelectedDateKey] = useState("");
  const [orderStep, setOrderStep] = useState<1 | 2>(1);
  const [closedDates, setClosedDates] = useState<string[]>([]);
  const [productsList, setProductsList] = useState<CustomerProduct[]>([]);
  const [contactDetails, setContactDetails] = useState(EMPTY_CONTACT_DETAILS);
  const [orderSettings, setOrderSettings] = useState({
    availableDatesCount: DEFAULT_ORDER_SETTINGS.availableDatesCount,
  });
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [orderNotes, setOrderNotes] = useState("");
  const [orderFormError, setOrderFormError] = useState("");
  const [isSubmittingOrder, setIsSubmittingOrder] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [galleryProduct, setGalleryProduct] = useState<CustomerProduct | null>(
    null
  );
  const [galleryIndex, setGalleryIndex] = useState(0);
  const [reviewsByProductId, setReviewsByProductId] = useState<
    Map<string, ProductReview[]>
  >(new Map());
  const [language, setLanguage] = useState<Language>("he");
  const [hasLoadedLanguage, setHasLoadedLanguage] = useState(false);
  const previousSelectedCategoryRef = useRef<ProductCategory | null>(null);

  const t = getTranslations(language);
  const pageDirection = getTextDirection(language);

  const formatDateOptionLabel = (date: Date): string => {
    return date.toLocaleDateString(getDateLocale(language), {
      weekday: "long",
      day: "numeric",
      month: "long",
    });
  };

  useEffect(() => {
    const stored = localStorage.getItem(LANGUAGE_STORAGE_KEY);
    if (stored && isLanguage(stored)) {
      setLanguage(stored);
    }
    setHasLoadedLanguage(true);
  }, []);

  useEffect(() => {
    if (!hasLoadedLanguage) {
      return;
    }

    localStorage.setItem(LANGUAGE_STORAGE_KEY, language);
  }, [language, hasLoadedLanguage]);

  const handleSelectCategory = (category: ProductCategory) => {
    if (selectedCategory === category) {
      setSelectedCategory(null);
      setSelectedSubcategory(SUBCATEGORY_FILTER_ALL);
      return;
    }

    setSelectedCategory(category);
    setSelectedSubcategory(SUBCATEGORY_FILTER_ALL);
  };

  useEffect(() => {
    if (!selectedCategory) {
      previousSelectedCategoryRef.current = null;
      return;
    }

    if (previousSelectedCategoryRef.current === selectedCategory) {
      return;
    }

    previousSelectedCategoryRef.current = selectedCategory;

    requestAnimationFrame(() => {
      document.getElementById("customer-products-section")?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    });
  }, [selectedCategory]);

  const categoryProducts = selectedCategory
    ? productsList.filter((product) => {
        if (product.category !== selectedCategory) {
          return false;
        }

        if (!categoryHasSubcategories(selectedCategory)) {
          return true;
        }

        if (selectedSubcategory === SUBCATEGORY_FILTER_ALL) {
          return true;
        }

        return product.subcategory === selectedSubcategory;
      })
    : [];

  const availableDates = orderProduct
    ? getAvailableDates(
        orderProduct.preparationDays,
        closedDates,
        orderSettings.availableDatesCount
      )
    : [];

  const selectedDate = selectedDateKey
    ? parseDateFromKey(selectedDateKey)
    : null;

  useEffect(() => {
    async function loadData() {
      setIsLoading(true);
      setLoadError("");

      try {
        const [
          productsResponse,
          productImagesRows,
          closedDatesResponse,
          contactResponse,
          orderSettingsResponse,
          reviewsResponse,
        ] = await Promise.all([
          supabase
            .from("products")
            .select(PRODUCT_SELECT_COLUMNS)
            .eq("is_active", true)
            .order("created_at", { ascending: true }),
          fetchAllProductImages(),
          supabase.from("closed_dates").select("closed_date"),
          supabase
            .from("contact_details")
            .select("phone, whatsapp, instagram, facebook, tiktok")
            .eq("id", 1)
            .maybeSingle(),
          supabase
            .from("order_settings")
            .select("available_dates_count, allow_same_day")
            .eq("id", 1)
            .maybeSingle(),
          supabase
            .from("reviews")
            .select("id, product_id, customer_name, rating, comment, created_at")
            .eq("is_visible", true)
            .order("created_at", { ascending: false }),
        ]);

        if (productsResponse.error) {
          throw productsResponse.error;
        }

        if (closedDatesResponse.error) {
          throw closedDatesResponse.error;
        }

        if (contactResponse.error) {
          console.error(contactResponse.error);
        }

        if (orderSettingsResponse.error) {
          console.error(orderSettingsResponse.error);
        }

        const groupedImages = groupProductImagesByProductId(productImagesRows);
        const mappedProducts = (productsResponse.data as SupabaseProductRow[])
          .map((row) => mapSupabaseProduct(row, groupedImages))
          .filter((product): product is CustomerProduct => product !== null);

        setProductsList(
          mappedProducts.length > 0 ? mappedProducts : mapDefaultProducts()
        );

        setClosedDates(
          (closedDatesResponse.data as SupabaseClosedDateRow[]).map((row) =>
            toClosedDateKey(row.closed_date)
          )
        );

        const contact = contactResponse.data as SupabaseContactRow | null;
        setContactDetails(
          contact
            ? {
                phone: contact.phone ?? "",
                whatsapp: contact.whatsapp ?? "",
                instagram: contact.instagram ?? "",
                facebook: contact.facebook ?? "",
                tiktok: contact.tiktok ?? "",
              }
            : EMPTY_CONTACT_DETAILS
        );

        const settings = orderSettingsResponse.data as SupabaseOrderSettingsRow | null;
        const count =
          settings?.available_dates_count ??
          DEFAULT_ORDER_SETTINGS.availableDatesCount;
        setOrderSettings({
          availableDatesCount: normalizeAvailableDatesCount(count),
        });

        const mappedReviews = reviewsResponse.error
          ? []
          : (reviewsResponse.data as SupabaseReviewRow[]).map((row) =>
              mapSupabaseReview(row)
            );
        if (reviewsResponse.error) {
          console.error(reviewsResponse.error);
        }
        setReviewsByProductId(groupReviewsByProductId(mappedReviews));
      } catch (error) {
        console.error(error);
        setLoadError(t.loadError);
        setProductsList(mapDefaultProducts());
        setReviewsByProductId(new Map());
      } finally {
        setIsLoading(false);
      }
    }

    loadData();
  }, []);

  const resetOrderForm = () => {
    setCustomerName("");
    setCustomerPhone("");
    setOrderNotes("");
    setSelectedDateKey("");
    setOrderStep(1);
    setOrderFormError("");
    setOrderSuccess(false);
    setIsSubmittingOrder(false);
  };

  const openOrderModal = (product: CustomerProduct) => {
    setOrderProduct(product);
    resetOrderForm();
  };

  const closeOrderModal = () => {
    setOrderProduct(null);
    resetOrderForm();
  };

  const handleContinueToDetails = () => {
    setOrderFormError("");

    if (!selectedDateKey) {
      setOrderFormError(t.validationSelectDate);
      return;
    }

    setOrderStep(2);
  };

  const handleBackToDate = () => {
    setOrderFormError("");
    setOrderStep(1);
  };

  const handleSubmitOrder = async () => {
    if (!orderProduct) {
      return;
    }

    setOrderFormError("");

    if (!selectedDateKey || !selectedDate) {
      setOrderFormError(t.validationSelectDate);
      return;
    }

    if (!customerName.trim()) {
      setOrderFormError(t.validationFullName);
      return;
    }

    if (!customerPhone.trim()) {
      setOrderFormError(t.validationPhone);
      return;
    }

    setIsSubmittingOrder(true);

    try {
      const { error } = await supabase.from("orders").insert({
        product_id: orderProduct.id,
        product_name: getLocalizedProductName(orderProduct, language),
        product_category: orderProduct.category,
        product_price: orderProduct.price,
        customer_name: customerName.trim(),
        customer_phone: customerPhone.trim(),
        requested_date: selectedDateKey,
        notes: orderNotes.trim() || null,
        status: "new",
      });

      if (error) {
        throw error;
      }

      setOrderSuccess(true);
    } catch (error) {
      console.error(error);
      setOrderFormError(t.orderSubmitError);
    } finally {
      setIsSubmittingOrder(false);
    }
  };

  const openGallery = (product: CustomerProduct, index = 0) => {
    setGalleryProduct(product);
    setGalleryIndex(index);
  };

  const closeGallery = () => {
    setGalleryProduct(null);
    setGalleryIndex(0);
  };

  const showGalleryPrevious = () => {
    if (!galleryProduct || galleryProduct.images.length <= 1) {
      return;
    }

    setGalleryIndex(
      (previous) =>
        (previous - 1 + galleryProduct.images.length) %
        galleryProduct.images.length
    );
  };

  const showGalleryNext = () => {
    if (!galleryProduct || galleryProduct.images.length <= 1) {
      return;
    }

    setGalleryIndex(
      (previous) => (previous + 1) % galleryProduct.images.length
    );
  };

  const handleBackToCategories = () => {
    document.getElementById("category-selector")?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  const phoneHref = contactDetails.phone.trim()
    ? buildPhoneHref(contactDetails.phone)
    : "";
  const whatsappContactHref = contactDetails.whatsapp.trim()
    ? buildWhatsAppHref(contactDetails.whatsapp, t.whatsappHello)
    : "";
  const instagramHref = buildInstagramHref(contactDetails.instagram);
  const facebookHref = buildFacebookHref(contactDetails.facebook);
  const tiktokHref = buildTikTokHref(contactDetails.tiktok);
  const hasContactButtons = Boolean(
    phoneHref || whatsappContactHref || instagramHref || facebookHref || tiktokHref
  );

  const customOrderWhatsAppHref =
    selectedCategory && contactDetails.whatsapp.trim()
      ? buildWhatsAppHref(
          contactDetails.whatsapp,
          t.customOrderWhatsAppMessage(
            getCategoryLabel(selectedCategory, language),
            selectedSubcategory !== SUBCATEGORY_FILTER_ALL
              ? ` / ${getSubcategoryLabel(selectedSubcategory, language)}`
              : ""
          )
        )
      : "";

  const consultationWhatsAppHref = contactDetails.whatsapp.trim()
    ? buildWhatsAppHref(
        contactDetails.whatsapp,
        t.consultationWhatsAppMessage
      )
    : "";

  return (
    <main className="boutique-page text-[#2f1f1b]" dir={pageDirection}>
      <LanguageSelect
        language={language}
        pageDirection={pageDirection}
        onLanguageChange={setLanguage}
      />

      <section className="boutique-content mx-auto max-w-[73.75rem] px-4 py-4 sm:px-6 sm:py-12">
        <CustomerHero
          translations={t}
          phoneHref={phoneHref}
          whatsappContactHref={whatsappContactHref}
          instagramHref={instagramHref}
          facebookHref={facebookHref}
          tiktokHref={tiktokHref}
          hasContactButtons={hasContactButtons}
        />

        <CategorySelector
          selectedCategory={selectedCategory}
          language={language}
          onSelectCategory={handleSelectCategory}
        />

        {selectedCategory && categoryHasSubcategories(selectedCategory) && (
          <SubcategorySelector
            category={selectedCategory}
            selectedSubcategory={selectedSubcategory}
            language={language}
            translations={t}
            onSelectSubcategory={setSelectedSubcategory}
          />
        )}

        <ProductGrid
          isLoading={isLoading}
          loadError={loadError}
          selectedCategory={selectedCategory}
          productRevealKey={
            selectedCategory
              ? `${selectedCategory}-${selectedSubcategory}`
              : null
          }
          products={categoryProducts}
          language={language}
          translations={t}
          reviewsByProductId={reviewsByProductId}
          customOrderWhatsAppHref={customOrderWhatsAppHref}
          onBackToCategories={handleBackToCategories}
          onOpenGallery={openGallery}
          onOpenOrder={openOrderModal}
        />

        <ComingSoonVanCard translations={t} />

        <HowItWorksSection translations={t} />

        <ConsultationCard
          translations={t}
          whatsappHref={consultationWhatsAppHref}
        />

        {!selectedCategory && !isLoading && (
          <ChooseCategoryPromptSection translations={t} />
        )}
      </section>

      {galleryProduct && galleryProduct.images.length > 0 && (
        <ProductGalleryModal
          productName={getLocalizedProductName(galleryProduct, language)}
          images={galleryProduct.images}
          currentIndex={galleryIndex}
          onClose={closeGallery}
          onPrevious={showGalleryPrevious}
          onNext={showGalleryNext}
          labels={{
            close: t.close,
            closeGallery: t.closeGallery,
            nextImage: t.nextImage,
            previousImage: t.previousImage,
            galleryTitle: t.galleryTitle,
            imageAlt: t.imageAlt,
          }}
        />
      )}

      {orderProduct && (
        <OrderModal
          product={orderProduct}
          language={language}
          translations={t}
          orderStep={orderStep}
          orderSuccess={orderSuccess}
          selectedDateKey={selectedDateKey}
          selectedDate={selectedDate}
          availableDates={availableDates}
          customerName={customerName}
          customerPhone={customerPhone}
          orderNotes={orderNotes}
          orderFormError={orderFormError}
          isSubmittingOrder={isSubmittingOrder}
          formatDateOptionLabel={formatDateOptionLabel}
          onClose={closeOrderModal}
          onSelectedDateKeyChange={(dateKey) => {
            setSelectedDateKey(dateKey);
            setOrderFormError("");
          }}
          onCustomerNameChange={(value) => {
            setCustomerName(value);
            setOrderFormError("");
          }}
          onCustomerPhoneChange={(value) => {
            setCustomerPhone(value);
            setOrderFormError("");
          }}
          onOrderNotesChange={setOrderNotes}
          onContinueToDetails={handleContinueToDetails}
          onBackToDate={handleBackToDate}
          onSubmitOrder={handleSubmitOrder}
        />
      )}
    </main>
  );
}
