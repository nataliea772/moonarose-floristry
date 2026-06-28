"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { type ProductCategory } from "@/data/products";
import { EMPTY_CONTACT_DETAILS } from "@/lib/contactStorage";
import {
  DEFAULT_ORDER_SETTINGS,
  type OrderSettings,
} from "@/lib/orderSettingsStorage";
import {
  buildOrderCancellationMessage,
  buildOrderConfirmationMessage,
  buildReviewRequestMessage,
  openCustomerWhatsApp,
  type OrderWhatsAppDetails,
} from "@/lib/orderWhatsApp";
import { buildReviewPageUrl } from "@/lib/reviews";
import { supabase } from "@/lib/supabaseClient";
import { clearAdminAuthCookie } from "@/lib/adminAuthCookie";
import {
  fetchAllProductImages,
  uploadProductImageFile,
  deleteProductImagesFromStorage,
  type ProductImageRecord,
} from "@/lib/productImages";
import { PRODUCT_SELECT_COLUMNS } from "@/lib/productTranslations";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { AdminTabs } from "@/components/admin/AdminTabs";
import { ClosedDatesTab } from "@/components/admin/ClosedDatesTab";
import { ContactDetailsTab } from "@/components/admin/ContactDetailsTab";
import { OrderSettingsTab } from "@/components/admin/OrderSettingsTab";
import { CalendarTab } from "@/components/admin/CalendarTab";
import { OrdersTab } from "@/components/admin/OrdersTab";
import { ProductsTab } from "@/components/admin/ProductsTab";
import { ReviewsTab } from "@/components/admin/ReviewsTab";
import { CLOSED_DATE_REASON } from "@/components/admin/constants";
import {
  buildProductTranslationPayload,
  createPreviewId,
  emptyProductForm,
  formatOrderDate,
  groupProductImagesByProductId,
  mapSupabaseClosedDate,
  mapSupabaseContactDetails,
  mapSupabaseOrder,
  mapSupabaseOrderSettings,
  mapSupabaseProduct,
  mapSupabaseReview,
  productToFormState,
  toDateKey,
  getMonthCalendarDays,
  type SupabaseClosedDateRow,
  type SupabaseContactRow,
  type SupabaseOrderRow,
  type SupabaseOrderSettingsRow,
  type SupabaseProductRow,
  type SupabaseReviewRow,
} from "@/components/admin/utils";
import {
  type AdminOrder,
  type AdminProduct,
  type AdminReview,
  type AdminTab,
  type ClosedDate,
  type OrderStatus,
  type PendingImagePreview,
  type ProductFormState,
} from "@/components/admin/types";

export default function AdminPage() {
  const router = useRouter();
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [selectedTab, setSelectedTab] = useState<AdminTab>("מוצרים");
  const [selectedCategory, setSelectedCategory] =
    useState<ProductCategory>("זרים");
  const [managedProducts, setManagedProducts] = useState<AdminProduct[]>([]);
  const [isLoadingProducts, setIsLoadingProducts] = useState(true);
  const [productsError, setProductsError] = useState("");
  const [showProductForm, setShowProductForm] = useState(false);
  const [editingProductId, setEditingProductId] = useState<string | null>(
    null
  );
  const [productForm, setProductForm] = useState<ProductFormState>(() =>
    emptyProductForm("זרים")
  );
  const [pendingImagePreviews, setPendingImagePreviews] = useState<
    PendingImagePreview[]
  >([]);
  const [existingProductImages, setExistingProductImages] = useState<
    ProductImageRecord[]
  >([]);
  const [removedImageIds, setRemovedImageIds] = useState<string[]>([]);
  const [formError, setFormError] = useState("");
  const [isSavingProduct, setIsSavingProduct] = useState(false);
  const [closedDates, setClosedDates] = useState<ClosedDate[]>([]);
  const [isLoadingClosedDates, setIsLoadingClosedDates] = useState(true);
  const [closedDatesError, setClosedDatesError] = useState("");
  const [calendarMonth, setCalendarMonth] = useState(() => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), 1);
  });
  const [contactDetails, setContactDetails] = useState(EMPTY_CONTACT_DETAILS);
  const [isLoadingContactDetails, setIsLoadingContactDetails] = useState(true);
  const [contactLoadError, setContactLoadError] = useState("");
  const [contactSaveMessage, setContactSaveMessage] = useState("");
  const [contactSaveError, setContactSaveError] = useState("");
  const [isSavingContactDetails, setIsSavingContactDetails] = useState(false);
  const [orderSettings, setOrderSettings] = useState<OrderSettings>(
    DEFAULT_ORDER_SETTINGS
  );
  const [availableDatesInput, setAvailableDatesInput] = useState("5");
  const [isLoadingOrderSettings, setIsLoadingOrderSettings] = useState(true);
  const [orderSettingsLoadError, setOrderSettingsLoadError] = useState("");
  const [orderSettingsError, setOrderSettingsError] = useState("");
  const [orderSettingsMessage, setOrderSettingsMessage] = useState("");
  const [isSavingOrderSettings, setIsSavingOrderSettings] = useState(false);
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [isLoadingOrders, setIsLoadingOrders] = useState(false);
  const [ordersError, setOrdersError] = useState("");
  const [orderStatusMessage, setOrderStatusMessage] = useState("");
  const [updatingOrderId, setUpdatingOrderId] = useState<string | null>(null);
  const [ordersSelectedDate, setOrdersSelectedDate] = useState(() =>
    toDateKey(new Date())
  );
  const [showAllOrders, setShowAllOrders] = useState(false);
  const [reviews, setReviews] = useState<AdminReview[]>([]);
  const [isLoadingReviews, setIsLoadingReviews] = useState(false);
  const [reviewsError, setReviewsError] = useState("");
  const [reviewActionMessage, setReviewActionMessage] = useState("");
  const [updatingReviewId, setUpdatingReviewId] = useState<string | null>(null);
  const [deletingReviewId, setDeletingReviewId] = useState<string | null>(null);

  const categoryProducts = managedProducts.filter(
    (product) => product.category === selectedCategory
  );
  const calendarDays = getMonthCalendarDays(calendarMonth);
  const closedDatesSet = new Set(closedDates.map((entry) => entry.closedDate));

  const visibleExistingImages = existingProductImages.filter(
    (image) => !removedImageIds.includes(image.id)
  );

  useEffect(() => {
    async function checkSession() {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        clearAdminAuthCookie();
        router.replace("/login");
        return;
      }

      setIsAuthenticated(true);
      setIsCheckingAuth(false);
    }

    checkSession();
  }, [router]);

  const fetchProducts = async () => {
    setIsLoadingProducts(true);
    setProductsError("");

    const [productsResponse, productImagesRows] = await Promise.all([
      supabase
        .from("products")
        .select(PRODUCT_SELECT_COLUMNS)
        .eq("is_active", true)
        .order("created_at", { ascending: true }),
      fetchAllProductImages(),
    ]);

    if (productsResponse.error) {
      setProductsError("לא הצלחנו לטעון מוצרים");
      setIsLoadingProducts(false);
      return;
    }

    const groupedImages = groupProductImagesByProductId(productImagesRows);
    const mapped = (productsResponse.data as SupabaseProductRow[])
      .map((row) => mapSupabaseProduct(row, groupedImages))
      .filter((product): product is AdminProduct => product !== null);

    setManagedProducts(mapped);
    setIsLoadingProducts(false);
  };

  useEffect(() => {
    if (!isAuthenticated) {
      return;
    }

    fetchProducts();
    fetchClosedDates();
    fetchContactDetails();
    fetchOrderSettings();
  }, [isAuthenticated]);

  useEffect(() => {
    if (
      !isAuthenticated ||
      (selectedTab !== "הזמנות" && selectedTab !== "יומן")
    ) {
      return;
    }

    fetchOrders();
  }, [isAuthenticated, selectedTab]);

  useEffect(() => {
    if (!isAuthenticated || selectedTab !== "ביקורות") {
      return;
    }

    fetchReviews();
  }, [isAuthenticated, selectedTab]);

  const fetchOrders = async () => {
    setIsLoadingOrders(true);
    setOrdersError("");

    const { data, error } = await supabase
      .from("orders")
      .select(
        "id, product_id, product_name, product_category, product_price, customer_name, customer_phone, requested_date, status, notes, created_at, updated_at"
      )
      .order("created_at", { ascending: false });

    if (error) {
      console.error(error);
      setOrdersError("לא הצלחנו לטעון הזמנות");
      setIsLoadingOrders(false);
      return;
    }

    const mapped = (data as SupabaseOrderRow[])
      .map((row) => mapSupabaseOrder(row))
      .filter((order): order is AdminOrder => order !== null);

    setOrders(mapped);
    setIsLoadingOrders(false);
  };

  const fetchReviews = async () => {
    setIsLoadingReviews(true);
    setReviewsError("");

    const { data, error } = await supabase
      .from("reviews")
      .select(
        "id, product_id, order_id, customer_name, rating, comment, is_visible, created_at"
      )
      .order("created_at", { ascending: false });

    if (error) {
      console.error(error);
      setReviewsError("לא הצלחנו לטעון ביקורות");
      setIsLoadingReviews(false);
      return;
    }

    const rows = (data as SupabaseReviewRow[]) ?? [];
    const productIds = [...new Set(rows.map((row) => row.product_id))];
    const productNames = new Map<string, string>();

    if (productIds.length > 0) {
      const { data: productsData, error: productsError } = await supabase
        .from("products")
        .select("id, name")
        .in("id", productIds);

      if (productsError) {
        console.error(productsError);
      } else {
        for (const product of productsData ?? []) {
          productNames.set(product.id, product.name);
        }
      }
    }

    setReviews(rows.map((row) => mapSupabaseReview(row, productNames)));
    setIsLoadingReviews(false);
  };

  const handleToggleReviewVisibility = async (review: AdminReview) => {
    setReviewActionMessage("");
    setUpdatingReviewId(review.id);

    const nextVisible = !review.isVisible;

    const { error } = await supabase
      .from("reviews")
      .update({ is_visible: nextVisible })
      .eq("id", review.id);

    if (error) {
      console.error(error);
      setReviewsError("לא הצלחנו לעדכן את הביקורת");
      setUpdatingReviewId(null);
      return;
    }

    setReviews((previous) =>
      previous.map((entry) =>
        entry.id === review.id ? { ...entry, isVisible: nextVisible } : entry
      )
    );
    setReviewsError("");
    setReviewActionMessage(
      nextVisible ? "הביקורת מוצגת באתר" : "הביקורת הוסתרה מהאתר"
    );
    setUpdatingReviewId(null);
  };

  const handleDeleteReview = async (reviewId: string) => {
    const confirmed = window.confirm("האם למחוק את הביקורת?");

    if (!confirmed) {
      return;
    }

    setReviewActionMessage("");
    setDeletingReviewId(reviewId);

    const { error } = await supabase.from("reviews").delete().eq("id", reviewId);

    if (error) {
      console.error(error);
      setReviewsError("לא הצלחנו למחוק את הביקורת");
      setDeletingReviewId(null);
      return;
    }

    setReviews((previous) => previous.filter((entry) => entry.id !== reviewId));
    setReviewsError("");
    setReviewActionMessage("הביקורת נמחקה");
    setDeletingReviewId(null);
  };

  const buildReviewRequestMessageForOrder = (order: AdminOrder): string => {
    return buildReviewRequestMessage({
      customerName: order.customerName,
      reviewLink: buildReviewPageUrl(
        window.location.origin,
        order.id,
        order.productId
      ),
    });
  };

  const updateOrderStatus = async (
    orderId: string,
    nextStatus: OrderStatus,
    successMessage: string
  ): Promise<boolean> => {
    setOrderStatusMessage("");
    setUpdatingOrderId(orderId);

    const { error } = await supabase
      .from("orders")
      .update({ status: nextStatus })
      .eq("id", orderId);

    if (error) {
      console.error(error);
      setOrdersError("לא הצלחנו לעדכן את סטטוס ההזמנה");
      setUpdatingOrderId(null);
      return false;
    }

    setOrders((previous) =>
      previous.map((order) =>
        order.id === orderId ? { ...order, status: nextStatus } : order
      )
    );
    setOrdersError("");
    setOrderStatusMessage(successMessage);
    setUpdatingOrderId(null);
    return true;
  };

  const getOrderWhatsAppDetails = (order: AdminOrder): OrderWhatsAppDetails => ({
    customerName: order.customerName,
    productName: order.productName,
    requestedDateLabel: formatOrderDate(order.requestedDate),
    productPrice: order.productPrice,
  });

  const handleApproveOrder = async (order: AdminOrder) => {
    const success = await updateOrderStatus(
      order.id,
      "confirmed",
      "ההזמנה אושרה"
    );

    if (!success) {
      return;
    }

    openCustomerWhatsApp(
      order.customerPhone,
      buildOrderConfirmationMessage(getOrderWhatsAppDetails(order))
    );
  };

  const handleCancelOrder = async (order: AdminOrder) => {
    const confirmed = window.confirm(
      "האם את בטוחה שברצונך לבטל את ההזמנה?"
    );

    if (!confirmed) {
      return;
    }

    const success = await updateOrderStatus(
      order.id,
      "cancelled",
      "ההזמנה בוטלה"
    );

    if (!success) {
      return;
    }

    openCustomerWhatsApp(
      order.customerPhone,
      buildOrderCancellationMessage(getOrderWhatsAppDetails(order))
    );
  };

  const handleCompleteOrder = async (order: AdminOrder) => {
    const success = await updateOrderStatus(
      order.id,
      "completed",
      "ההזמנה הושלמה"
    );

    if (!success) {
      return;
    }

    openCustomerWhatsApp(
      order.customerPhone,
      buildReviewRequestMessageForOrder(order)
    );
  };

  const handleResendConfirmationWhatsApp = (order: AdminOrder) => {
    openCustomerWhatsApp(
      order.customerPhone,
      buildOrderConfirmationMessage(getOrderWhatsAppDetails(order))
    );
  };

  const handleResendCancellationWhatsApp = (order: AdminOrder) => {
    openCustomerWhatsApp(
      order.customerPhone,
      buildOrderCancellationMessage(getOrderWhatsAppDetails(order))
    );
  };

  const handleResendCompletionWhatsApp = (order: AdminOrder) => {
    openCustomerWhatsApp(
      order.customerPhone,
      buildReviewRequestMessageForOrder(order)
    );
  };

  const handleOrdersDateChange = (dateKey: string) => {
    setOrdersSelectedDate(dateKey);
    setShowAllOrders(false);
    setOrderStatusMessage("");
  };

  const handleShowAllOrders = () => {
    setShowAllOrders(true);
    setOrderStatusMessage("");
  };

  const handleOpenInOrdersTab = (dateKey: string) => {
    setOrdersSelectedDate(dateKey);
    setShowAllOrders(false);
    setOrderStatusMessage("");
    setSelectedTab("הזמנות");
  };

  const fetchOrderSettings = async () => {
    setIsLoadingOrderSettings(true);
    setOrderSettingsLoadError("");

    const { data, error } = await supabase
      .from("order_settings")
      .select("available_dates_count, allow_same_day")
      .eq("id", 1)
      .maybeSingle();

    if (error) {
      setOrderSettingsLoadError("לא הצלחנו לטעון את הגדרות ההזמנות");
      setIsLoadingOrderSettings(false);
      return;
    }

    if (data) {
      const mapped = mapSupabaseOrderSettings(data as SupabaseOrderSettingsRow);
      setOrderSettings(mapped);
      setAvailableDatesInput(String(mapped.availableDatesCount));
    } else {
      setOrderSettings(DEFAULT_ORDER_SETTINGS);
      setAvailableDatesInput(String(DEFAULT_ORDER_SETTINGS.availableDatesCount));
    }

    setIsLoadingOrderSettings(false);
  };

  const fetchContactDetails = async () => {
    setIsLoadingContactDetails(true);
    setContactLoadError("");

    const { data, error } = await supabase
      .from("contact_details")
      .select("phone, whatsapp, instagram, facebook, tiktok")
      .eq("id", 1)
      .maybeSingle();

    if (error) {
      setContactLoadError("לא הצלחנו לטעון פרטי קשר");
      setIsLoadingContactDetails(false);
      return;
    }

    if (data) {
      setContactDetails(mapSupabaseContactDetails(data as SupabaseContactRow));
    } else {
      setContactDetails(EMPTY_CONTACT_DETAILS);
    }

    setIsLoadingContactDetails(false);
  };

  const fetchClosedDates = async () => {
    setIsLoadingClosedDates(true);
    setClosedDatesError("");

    const { data, error } = await supabase
      .from("closed_dates")
      .select("id, closed_date, reason, created_at")
      .order("closed_date", { ascending: true });

    if (error) {
      setClosedDatesError("לא הצלחנו לטעון ימים סגורים");
      setIsLoadingClosedDates(false);
      return;
    }

    setClosedDates(
      (data as SupabaseClosedDateRow[]).map(mapSupabaseClosedDate)
    );
    setIsLoadingClosedDates(false);
  };

  const toggleCalendarDate = async (dateKey: string) => {
    if (closedDatesSet.has(dateKey)) {
      await supabase.from("closed_dates").delete().eq("closed_date", dateKey);
    } else {
      const { error } = await supabase.from("closed_dates").insert({
        closed_date: dateKey,
        reason: CLOSED_DATE_REASON,
      });

      if (error) {
        await fetchClosedDates();
        return;
      }
    }

    await fetchClosedDates();
  };

  const reopenClosedDate = async (dateKey: string) => {
    const { error } = await supabase
      .from("closed_dates")
      .delete()
      .eq("closed_date", dateKey);

    if (error) {
      return;
    }

    setClosedDates((previous) =>
      previous.filter((entry) => entry.closedDate !== dateKey)
    );
  };

  const resetProductImageState = () => {
    setPendingImagePreviews([]);
    setExistingProductImages([]);
    setRemovedImageIds([]);
  };

  const openProductForm = () => {
    setEditingProductId(null);
    resetProductImageState();
    setProductForm(emptyProductForm(selectedCategory));
    setFormError("");
    setShowProductForm(true);
  };

  const openEditProductForm = (product: AdminProduct) => {
    setEditingProductId(product.id);
    resetProductImageState();
    setExistingProductImages(product.images);
    setProductForm(productToFormState(product));
    setFormError("");
    setShowProductForm(true);
  };

  const closeProductForm = () => {
    setShowProductForm(false);
    setEditingProductId(null);
    resetProductImageState();
    setFormError("");
    setProductForm(emptyProductForm(selectedCategory));
  };

  const syncProductMainImage = async (
    productId: string,
    imageUrls: string[]
  ) => {
    await supabase
      .from("products")
      .update({ image_url: imageUrls[0] ?? null })
      .eq("id", productId);
  };

  const handleSaveProduct = async () => {
    const name = productForm.name.trim();
    const description = productForm.description.trim();
    const price = Number(productForm.price);
    const preparationDays = Number(productForm.preparationDays);
    const translationPayload = buildProductTranslationPayload(productForm);

    if (!name) {
      setFormError("יש להזין שם מוצר.");
      return;
    }

    if (!productForm.category) {
      setFormError("יש לבחור קטגוריה.");
      return;
    }

    if (!description) {
      setFormError("יש להזין תיאור.");
      return;
    }

    if (!Number.isFinite(price) || price <= 0) {
      setFormError("יש להזין מחיר חיובי.");
      return;
    }

    if (!Number.isFinite(preparationDays) || preparationDays < 0) {
      setFormError("יש להזין זמן הכנה תקין (0 ומעלה).");
      return;
    }

    setIsSavingProduct(true);
    setFormError("");

    if (editingProductId !== null) {
      const { error: updateError } = await supabase
        .from("products")
        .update({
          ...translationPayload,
          category: productForm.category,
          price,
          preparation_days: preparationDays,
        })
        .eq("id", editingProductId);

      if (updateError) {
        setFormError("לא הצלחנו לעדכן את המוצר. נסו שוב.");
        setIsSavingProduct(false);
        return;
      }

      if (removedImageIds.length > 0) {
        const removedImages = existingProductImages.filter((image) =>
          removedImageIds.includes(image.id)
        );

        const { error: deleteImagesError } = await supabase
          .from("product_images")
          .delete()
          .in("id", removedImageIds);

        if (deleteImagesError) {
          setFormError("לא הצלחנו למחוק את התמונות. נסו שוב.");
          setIsSavingProduct(false);
          return;
        }

        await deleteProductImagesFromStorage(
          removedImages.map((image) => image.imageUrl)
        );
      }

      const remainingImages = existingProductImages.filter(
        (image) => !removedImageIds.includes(image.id)
      );
      let nextSortOrder =
        remainingImages.length > 0
          ? Math.max(...remainingImages.map((image) => image.sortOrder)) + 1
          : 0;

      const uploadedUrls: string[] = [];

      for (const pending of pendingImagePreviews) {
        const uploadedUrl = await uploadProductImageFile(
          editingProductId,
          pending.file
        );

        if (!uploadedUrl) {
          setFormError("לא הצלחנו להעלות את התמונה. נסו שוב.");
          setIsSavingProduct(false);
          return;
        }

        const { error: insertImageError } = await supabase
          .from("product_images")
          .insert({
            product_id: editingProductId,
            image_url: uploadedUrl,
            sort_order: nextSortOrder,
          });

        if (insertImageError) {
          setFormError("לא הצלחנו לשמור את התמונות. נסו שוב.");
          setIsSavingProduct(false);
          return;
        }

        uploadedUrls.push(uploadedUrl);
        nextSortOrder += 1;
      }

      const finalImageUrls = [
        ...remainingImages.map((image) => image.imageUrl),
        ...uploadedUrls,
      ];
      const preservedImageUrls =
        finalImageUrls.length === 0 &&
        removedImageIds.length === 0 &&
        pendingImagePreviews.length === 0
          ? (managedProducts.find((product) => product.id === editingProductId)
              ?.image
              ? [
                  managedProducts.find(
                    (product) => product.id === editingProductId
                  )!.image,
                ]
              : [])
          : finalImageUrls;
      await syncProductMainImage(editingProductId, preservedImageUrls);
    } else {
      const { data: insertedProduct, error: insertError } = await supabase
        .from("products")
        .insert({
          ...translationPayload,
          category: productForm.category,
          price,
          preparation_days: preparationDays,
          image_url: null,
          is_active: true,
        })
        .select("id")
        .single();

      if (insertError || !insertedProduct) {
        setFormError("לא הצלחנו להוסיף את המוצר. נסו שוב.");
        setIsSavingProduct(false);
        return;
      }

      const productId = insertedProduct.id as string;
      const uploadedUrls: string[] = [];

      for (let index = 0; index < pendingImagePreviews.length; index++) {
        const pending = pendingImagePreviews[index];
        const uploadedUrl = await uploadProductImageFile(productId, pending.file);

        if (!uploadedUrl) {
          setFormError("לא הצלחנו להעלות את התמונה. נסו שוב.");
          setIsSavingProduct(false);
          return;
        }

        const { error: insertImageError } = await supabase
          .from("product_images")
          .insert({
            product_id: productId,
            image_url: uploadedUrl,
            sort_order: index,
          });

        if (insertImageError) {
          setFormError("לא הצלחנו לשמור את התמונות. נסו שוב.");
          setIsSavingProduct(false);
          return;
        }

        uploadedUrls.push(uploadedUrl);
      }

      await syncProductMainImage(productId, uploadedUrls);
    }

    setSelectedCategory(productForm.category);
    closeProductForm();
    setIsSavingProduct(false);
    await fetchProducts();
  };

  const deleteProduct = async (productId: string) => {
    if (!confirm("האם למחוק את המוצר?")) {
      return;
    }

    const { error } = await supabase
      .from("products")
      .update({ is_active: false })
      .eq("id", productId);

    if (error) {
      return;
    }

    setManagedProducts((previous) =>
      previous.filter((product) => product.id !== productId)
    );
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) {
      return;
    }

    Array.from(files).forEach((file) => {
      const previewId = createPreviewId();
      const reader = new FileReader();

      reader.onload = () => {
        const result = reader.result;
        if (typeof result === "string") {
          setPendingImagePreviews((previous) => [
            ...previous,
            { id: previewId, file, preview: result },
          ]);
        }
      };

      reader.readAsDataURL(file);
    });

    event.target.value = "";
  };

  const removePendingImage = (previewId: string) => {
    setPendingImagePreviews((previous) =>
      previous.filter((preview) => preview.id !== previewId)
    );
  };

  const removeExistingImage = (imageId: string) => {
    setRemovedImageIds((previous) =>
      previous.includes(imageId) ? previous : [...previous, imageId]
    );
  };

  const handleSaveContactDetails = async () => {
    setContactSaveMessage("");
    setContactSaveError("");
    setIsSavingContactDetails(true);

    const payload = {
      id: 1,
      phone: contactDetails.phone.trim() || null,
      whatsapp: contactDetails.whatsapp.trim() || null,
      instagram: contactDetails.instagram.trim() || null,
      facebook: contactDetails.facebook.trim() || null,
      tiktok: contactDetails.tiktok.trim() || null,
    };

    const { error } = await supabase
      .from("contact_details")
      .upsert(payload, { onConflict: "id" });

    setIsSavingContactDetails(false);

    if (error) {
      setContactSaveError("לא הצלחנו לשמור את פרטי הקשר");
      return;
    }

    setContactSaveMessage("פרטי הקשר נשמרו בהצלחה");
  };

  const handleSaveOrderSettings = async () => {
    setOrderSettingsError("");
    setOrderSettingsMessage("");

    const count = Number(availableDatesInput);

    if (!Number.isFinite(count) || count < 1 || count > 30) {
      setOrderSettingsError("מספר התאריכים חייב להיות בין 1 ל-30.");
      return;
    }

    setIsSavingOrderSettings(true);

    const payload = {
      id: 1,
      available_dates_count: Math.round(count),
      allow_same_day: false,
    };

    const { error } = await supabase
      .from("order_settings")
      .upsert(payload, { onConflict: "id" });

    setIsSavingOrderSettings(false);

    if (error) {
      setOrderSettingsError("לא הצלחנו לשמור את הגדרות ההזמנות");
      return;
    }

    const mapped = mapSupabaseOrderSettings({
      available_dates_count: payload.available_dates_count,
      allow_same_day: false,
    });
    setOrderSettings(mapped);
    setAvailableDatesInput(String(mapped.availableDatesCount));
    setOrderSettingsMessage("הגדרות ההזמנות נשמרו בהצלחה");
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    clearAdminAuthCookie();
    router.replace("/login");
  };

  if (isCheckingAuth) {
    return (
      <main
        className="admin-page flex min-h-screen items-center justify-center"
        dir="rtl"
      >
        <p className="admin-message-muted">בודק הרשאה...</p>
      </main>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <main className="admin-page text-[#2f1f1b]" dir="rtl">
      <div className="admin-shell">
        <div className="admin-topbar">
          <Link href="/" className="contact-btn">
            חזרה לאתר
          </Link>
          <button type="button" className="contact-btn" onClick={handleLogout}>
            התנתקות
          </button>
        </div>

        <AdminHeader />

        <AdminTabs selectedTab={selectedTab} onSelectTab={setSelectedTab} />

        {selectedTab === "מוצרים" && (
          <ProductsTab
            categoryProducts={categoryProducts}
            selectedCategory={selectedCategory}
            onSelectCategory={setSelectedCategory}
            showProductForm={showProductForm}
            editingProductId={editingProductId}
            productForm={productForm}
            onProductFormChange={setProductForm}
            visibleExistingImages={visibleExistingImages}
            pendingImagePreviews={pendingImagePreviews}
            formError={formError}
            isSavingProduct={isSavingProduct}
            isLoadingProducts={isLoadingProducts}
            productsError={productsError}
            onOpenProductForm={openProductForm}
            onCloseProductForm={closeProductForm}
            onSaveProduct={handleSaveProduct}
            onImageUpload={handleImageUpload}
            onRemovePendingImage={removePendingImage}
            onRemoveExistingImage={removeExistingImage}
            onEditProduct={openEditProductForm}
            onDeleteProduct={deleteProduct}
          />
        )}

        {selectedTab === "ימים סגורים" && (
          <ClosedDatesTab
            isLoadingClosedDates={isLoadingClosedDates}
            closedDatesError={closedDatesError}
            calendarMonth={calendarMonth}
            onCalendarMonthChange={setCalendarMonth}
            calendarDays={calendarDays}
            closedDatesSet={closedDatesSet}
            closedDates={closedDates}
            onToggleCalendarDate={toggleCalendarDate}
            onReopenClosedDate={reopenClosedDate}
          />
        )}

        {selectedTab === "פרטי קשר" && (
          <ContactDetailsTab
            isLoadingContactDetails={isLoadingContactDetails}
            contactLoadError={contactLoadError}
            contactDetails={contactDetails}
            onContactDetailsChange={setContactDetails}
            contactSaveMessage={contactSaveMessage}
            contactSaveError={contactSaveError}
            isSavingContactDetails={isSavingContactDetails}
            onSaveContactDetails={handleSaveContactDetails}
          />
        )}

        {selectedTab === "הגדרות הזמנות" && (
          <OrderSettingsTab
            isLoadingOrderSettings={isLoadingOrderSettings}
            orderSettingsLoadError={orderSettingsLoadError}
            availableDatesInput={availableDatesInput}
            onAvailableDatesInputChange={setAvailableDatesInput}
            orderSettingsError={orderSettingsError}
            orderSettingsMessage={orderSettingsMessage}
            isSavingOrderSettings={isSavingOrderSettings}
            onSaveOrderSettings={handleSaveOrderSettings}
          />
        )}

        {selectedTab === "הזמנות" && (
          <OrdersTab
            orders={orders}
            isLoadingOrders={isLoadingOrders}
            ordersError={ordersError}
            orderStatusMessage={orderStatusMessage}
            ordersSelectedDate={ordersSelectedDate}
            showAllOrders={showAllOrders}
            updatingOrderId={updatingOrderId}
            onFetchOrders={fetchOrders}
            onOrdersDateChange={handleOrdersDateChange}
            onShowAllOrders={handleShowAllOrders}
            onApproveOrder={handleApproveOrder}
            onCancelOrder={handleCancelOrder}
            onCompleteOrder={handleCompleteOrder}
            onResendConfirmationWhatsApp={handleResendConfirmationWhatsApp}
            onResendCancellationWhatsApp={handleResendCancellationWhatsApp}
            onResendCompletionWhatsApp={handleResendCompletionWhatsApp}
          />
        )}

        {selectedTab === "יומן" && (
          <CalendarTab
            orders={orders}
            isLoadingOrders={isLoadingOrders}
            ordersError={ordersError}
            onFetchOrders={fetchOrders}
            onOpenInOrdersTab={handleOpenInOrdersTab}
          />
        )}

        {selectedTab === "ביקורות" && (
          <ReviewsTab
            isLoadingReviews={isLoadingReviews}
            reviewsError={reviewsError}
            reviewActionMessage={reviewActionMessage}
            reviews={reviews}
            updatingReviewId={updatingReviewId}
            deletingReviewId={deletingReviewId}
            onFetchReviews={fetchReviews}
            onToggleReviewVisibility={handleToggleReviewVisibility}
            onDeleteReview={handleDeleteReview}
          />
        )}
      </div>
    </main>
  );
}
