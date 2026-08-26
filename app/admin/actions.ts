"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { ProductCategory, ProductSize } from "@/lib/types";
import { CATEGORIES, SIZES } from "@/lib/constants";

/**
 * Server Actions for Admin Product Management
 * Authenticated via Supabase session cookie on the server.
 */

interface ActionResult {
  success?: boolean;
  error?: string;
  id?: string;
}

export async function createProductAction(formData: FormData): Promise<ActionResult> {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return { error: "Unauthorized: Please log in to perform this action." };
    }

    const title = (formData.get("title") as string)?.trim();
    const description = (formData.get("description") as string)?.trim() || null;
    const priceRaw = formData.get("price") as string;
    const price = parseFloat(priceRaw);
    const category = formData.get("category") as ProductCategory;
    const sizesRaw = formData.getAll("sizes") as ProductSize[];
    const colorsRaw = formData.get("colors") as string;
    const imageUrl = (formData.get("image_url") as string)?.trim();
    const imageUrlsRaw = formData.get("image_urls") as string;
    const inStock = formData.get("in_stock") === "true";

    // Validation
    if (!title) {
      return { error: "Product title is required." };
    }
    if (isNaN(price) || price <= 0) {
      return { error: "Valid price greater than ₦0 is required." };
    }
    if (!category || !CATEGORIES.includes(category)) {
      return { error: "Valid product category is required." };
    }
    const sizes = sizesRaw.filter((s) => SIZES.includes(s));
    if (sizes.length === 0) {
      return { error: "Please select at least one available size." };
    }
    if (!imageUrl) {
      return { error: "Product photo is required." };
    }

    const colors = colorsRaw
      ? colorsRaw
          .split(",")
          .map((c) => c.trim())
          .filter(Boolean)
      : [];

    const imageUrls = imageUrlsRaw
      ? imageUrlsRaw
          .split(",")
          .map((u) => u.trim())
          .filter(Boolean)
      : [];

    const { data, error } = await supabase
      .from("products")
      .insert({
        title,
        description,
        price,
        category,
        sizes,
        colors,
        image_url: imageUrl,
        image_urls: imageUrls,
        in_stock: inStock,
      })
      .select("id")
      .single();

    if (error) {
      return { error: error.message };
    }

    // Revalidate public catalog and admin routes
    revalidatePath("/");
    revalidatePath("/shop");
    revalidatePath(`/shop/${category.toLowerCase()}`);
    revalidatePath("/admin");

    return { success: true, id: data.id };
  } catch (err: any) {
    return { error: err.message || "Failed to create product." };
  }
}

export async function updateProductAction(
  id: string,
  formData: FormData
): Promise<ActionResult> {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return { error: "Unauthorized: Please log in to perform this action." };
    }

    const title = (formData.get("title") as string)?.trim();
    const description = (formData.get("description") as string)?.trim() || null;
    const priceRaw = formData.get("price") as string;
    const price = parseFloat(priceRaw);
    const category = formData.get("category") as ProductCategory;
    const sizesRaw = formData.getAll("sizes") as ProductSize[];
    const colorsRaw = formData.get("colors") as string;
    const imageUrl = (formData.get("image_url") as string)?.trim();
    const imageUrlsRaw = formData.get("image_urls") as string;
    const inStock = formData.get("in_stock") === "true";

    // Validation
    if (!title) {
      return { error: "Product title is required." };
    }
    if (isNaN(price) || price <= 0) {
      return { error: "Valid price greater than ₦0 is required." };
    }
    if (!category || !CATEGORIES.includes(category)) {
      return { error: "Valid product category is required." };
    }
    const sizes = sizesRaw.filter((s) => SIZES.includes(s));
    if (sizes.length === 0) {
      return { error: "Please select at least one available size." };
    }
    if (!imageUrl) {
      return { error: "Product photo is required." };
    }

    const colors = colorsRaw
      ? colorsRaw
          .split(",")
          .map((c) => c.trim())
          .filter(Boolean)
      : [];

    const imageUrls = imageUrlsRaw
      ? imageUrlsRaw
          .split(",")
          .map((u) => u.trim())
          .filter(Boolean)
      : [];

    const { error } = await supabase
      .from("products")
      .update({
        title,
        description,
        price,
        category,
        sizes,
        colors,
        image_url: imageUrl,
        image_urls: imageUrls,
        in_stock: inStock,
      })
      .eq("id", id);

    if (error) {
      return { error: error.message };
    }

    // Revalidate affected routes
    revalidatePath("/");
    revalidatePath("/shop");
    revalidatePath(`/shop/${category.toLowerCase()}`);
    revalidatePath(`/product/${id}`);
    revalidatePath("/admin");

    return { success: true };
  } catch (err: any) {
    return { error: err.message || "Failed to update product." };
  }
}

export async function deleteProductAction(
  id: string,
  imageUrl?: string
): Promise<ActionResult> {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return { error: "Unauthorized: Please log in to perform this action." };
    }

    // Optional: remove image from storage bucket if it's hosted on Supabase Storage
    if (imageUrl && imageUrl.includes("/product-images/")) {
      try {
        const pathParts = imageUrl.split("/product-images/");
        if (pathParts[1]) {
          await supabase.storage.from("product-images").remove([pathParts[1]]);
        }
      } catch {
        // Continue even if storage delete fails
      }
    }

    const { error } = await supabase.from("products").delete().eq("id", id);

    if (error) {
      return { error: error.message };
    }

    revalidatePath("/");
    revalidatePath("/shop");
    revalidatePath("/admin");

    return { success: true };
  } catch (err: any) {
    return { error: err.message || "Failed to delete product." };
  }
}

export async function toggleStockAction(
  id: string,
  inStock: boolean
): Promise<ActionResult> {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return { error: "Unauthorized: Please log in to perform this action." };
    }

    const { error } = await supabase
      .from("products")
      .update({ in_stock: inStock })
      .eq("id", id);

    if (error) {
      return { error: error.message };
    }

    revalidatePath("/");
    revalidatePath("/shop");
    revalidatePath(`/product/${id}`);
    revalidatePath("/admin");

    return { success: true };
  } catch (err: any) {
    return { error: err.message || "Failed to update stock status." };
  }
}

/**
 * Server Actions for Customer Gallery Management
 */

export async function createGalleryImageAction(
  formData: FormData
): Promise<ActionResult> {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return { error: "Unauthorized: Please log in to perform this action." };
    }

    const imageUrl = (formData.get("image_url") as string)?.trim();
    const caption = (formData.get("caption") as string)?.trim() || null;
    const displayOrderRaw = formData.get("display_order") as string;
    const displayOrder = displayOrderRaw ? parseInt(displayOrderRaw, 10) : 0;

    if (!imageUrl) {
      return { error: "Gallery photo is required." };
    }

    const { data, error } = await supabase
      .from("gallery_images")
      .insert({
        image_url: imageUrl,
        caption,
        display_order: isNaN(displayOrder) ? 0 : displayOrder,
      })
      .select("id")
      .single();

    if (error) {
      return { error: error.message };
    }

    revalidatePath("/gallery");
    revalidatePath("/admin/gallery");

    return { success: true, id: data.id };
  } catch (err: any) {
    return { error: err.message || "Failed to add gallery photo." };
  }
}

export async function deleteGalleryImageAction(
  id: string,
  imageUrl?: string
): Promise<ActionResult> {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return { error: "Unauthorized: Please log in to perform this action." };
    }

    // Clean up Supabase Storage object if stored in gallery-images bucket
    if (imageUrl && imageUrl.includes("/gallery-images/")) {
      try {
        const pathParts = imageUrl.split("/gallery-images/");
        if (pathParts[1]) {
          await supabase.storage.from("gallery-images").remove([pathParts[1]]);
        }
      } catch {
        // Continue even if storage delete encounters an issue
      }
    }

    const { error } = await supabase
      .from("gallery_images")
      .delete()
      .eq("id", id);

    if (error) {
      return { error: error.message };
    }

    revalidatePath("/gallery");
    revalidatePath("/admin/gallery");

    return { success: true };
  } catch (err: any) {
    return { error: err.message || "Failed to delete gallery photo." };
  }
}

