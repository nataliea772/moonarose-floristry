import { supabase } from "@/lib/supabaseClient";

export type ProductImageRecord = {
  id: string;
  productId: string;
  imageUrl: string;
  sortOrder: number;
};

export type SupabaseProductImageRow = {
  id: string;
  product_id: string;
  image_url: string;
  sort_order: number;
};

export function mapSupabaseProductImage(
  row: SupabaseProductImageRow
): ProductImageRecord {
  return {
    id: row.id,
    productId: row.product_id,
    imageUrl: row.image_url,
    sortOrder: row.sort_order,
  };
}

export function groupProductImagesByProductId(
  rows: ProductImageRecord[]
): Map<string, ProductImageRecord[]> {
  const grouped = new Map<string, ProductImageRecord[]>();

  for (const row of rows) {
    const existing = grouped.get(row.productId) ?? [];
    existing.push(row);
    grouped.set(row.productId, existing);
  }

  for (const [productId, images] of grouped) {
    grouped.set(
      productId,
      [...images].sort((a, b) => a.sortOrder - b.sortOrder)
    );
  }

  return grouped;
}

export function resolveProductImageUrls(
  productId: string,
  fallbackImageUrl: string | null | undefined,
  grouped: Map<string, ProductImageRecord[]>
): string[] {
  const images = grouped.get(productId) ?? [];

  if (images.length > 0) {
    return images.map((image) => image.imageUrl);
  }

  if (fallbackImageUrl) {
    return [fallbackImageUrl];
  }

  return [];
}

export function safeFileName(name: string): string {
  return name.replace(/[^a-zA-Z0-9._-]/g, "_");
}

export const PRODUCT_IMAGES_BUCKET = "product-images";

const PRODUCT_IMAGES_PUBLIC_PATH_MARKER = `/object/public/${PRODUCT_IMAGES_BUCKET}/`;

export function extractProductImageStoragePath(
  imageUrl: string
): string | null {
  const trimmed = imageUrl.trim();
  if (!trimmed) {
    return null;
  }

  try {
    const url = new URL(trimmed);
    const markerIndex = url.pathname.indexOf(PRODUCT_IMAGES_PUBLIC_PATH_MARKER);

    if (markerIndex === -1) {
      return null;
    }

    const storagePath = decodeURIComponent(
      url.pathname.slice(markerIndex + PRODUCT_IMAGES_PUBLIC_PATH_MARKER.length)
    );

    if (!storagePath || storagePath.includes("..")) {
      return null;
    }

    return storagePath;
  } catch {
    return null;
  }
}

export type DeleteProductImageFileResult =
  | { status: "deleted" }
  | { status: "skipped"; reason: "external_or_unparseable_url" }
  | { status: "failed"; error: string; storagePath: string };

export async function deleteProductImageFile(
  imageUrl: string
): Promise<DeleteProductImageFileResult> {
  const storagePath = extractProductImageStoragePath(imageUrl);

  if (!storagePath) {
    return { status: "skipped", reason: "external_or_unparseable_url" };
  }

  const { error } = await supabase.storage
    .from(PRODUCT_IMAGES_BUCKET)
    .remove([storagePath]);

  if (error) {
    console.warn(
      `Failed to delete product image from storage (${storagePath}):`,
      error.message
    );
    return { status: "failed", error: error.message, storagePath };
  }

  return { status: "deleted" };
}

export async function deleteProductImagesFromStorage(
  imageUrls: string[]
): Promise<string[]> {
  const warnings: string[] = [];

  for (const imageUrl of imageUrls) {
    const result = await deleteProductImageFile(imageUrl);

    if (result.status === "failed") {
      warnings.push(`${result.storagePath}: ${result.error}`);
    }
  }

  if (warnings.length > 0) {
    console.warn(
      "Some product image files could not be removed from Supabase Storage:",
      warnings
    );
  }

  return warnings;
}

export async function uploadProductImageFile(
  productId: string,
  file: File
): Promise<string | null> {
  const path = `products/${productId}/${Date.now()}-${safeFileName(file.name)}`;
  const { error } = await supabase.storage
    .from("product-images")
    .upload(path, file);

  if (error) {
    return null;
  }

  const { data } = supabase.storage.from("product-images").getPublicUrl(path);
  return data.publicUrl;
}

export async function fetchAllProductImages(): Promise<ProductImageRecord[]> {
  const { data, error } = await supabase
    .from("product_images")
    .select("id, product_id, image_url, sort_order")
    .order("sort_order", { ascending: true });

  if (error || !data) {
    return [];
  }

  return (data as SupabaseProductImageRow[]).map(mapSupabaseProductImage);
}
