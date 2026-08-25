import { OrderDetails } from "../types";
import { formatNaira } from "../utils/currency";
import { createClient } from "../supabase/client";

/**
 * WhatsApp Round-Robin Load Balancer
 * 
 * Single Source of Truth for Elmik Stitches WhatsApp contact numbers.
 * Numbers are in E.164 international format:
 * - 08075514345 -> 2348075514345
 * - 08033109393 -> 2348033109393
 */
export const WHATSAPP_NUMBERS = ["2348075514345", "2348033109393"] as const;
const STORAGE_KEY = "elmik_last_wa_index";

// In-memory fallback for environments where localStorage is unavailable (e.g. incognito restrictions)
let memoryLastIndex = -1;

/**
 * Strategy A (Client Fallback) — Strict deterministic alternation via localStorage
 * Guarantee: Even 50/50 alternation per browser/device.
 */
export function getLocalNextWhatsAppNumber(): string {
  if (typeof window === "undefined") {
    // SSR guard — safely return primary index 0
    return WHATSAPP_NUMBERS[0];
  }

  try {
    const lastIndexRaw = window.localStorage.getItem(STORAGE_KEY);
    const lastIndex = lastIndexRaw === null ? -1 : parseInt(lastIndexRaw, 10);
    const nextIndex = (lastIndex + 1) % 2;
    window.localStorage.setItem(STORAGE_KEY, String(nextIndex));
    return WHATSAPP_NUMBERS[nextIndex];
  } catch {
    memoryLastIndex = (memoryLastIndex + 1) % 2;
    return WHATSAPP_NUMBERS[memoryLastIndex];
  }
}

/**
 * Preferred Strategy (Global Atomic Counter via Supabase RPC)
 * Calls the `get_next_whatsapp_index()` Postgres function to guarantee true cross-device,
 * globally fair 50/50 alternation. Automatically falls back to localStorage if network/RPC is unavailable.
 */
export async function getNextWhatsAppNumber(): Promise<string> {
  if (typeof window === "undefined") {
    return WHATSAPP_NUMBERS[0];
  }

  try {
    const supabase = createClient();
    const { data, error } = await supabase.rpc("get_next_whatsapp_index");

    if (error || data === null || data === undefined) {
      return getLocalNextWhatsAppNumber();
    }

    const index = (Math.abs(Number(data))) % 2;
    try {
      window.localStorage.setItem(STORAGE_KEY, String(index));
    } catch {}

    return WHATSAPP_NUMBERS[index];
  } catch {
    return getLocalNextWhatsAppNumber();
  }
}

/**
 * Formats order or restock inquiries into pre-filled, emoji-free WhatsApp messages.
 * Verified for clean rendering on both iOS and Android WhatsApp.
 */
export function buildWhatsAppMessage(order: OrderDetails): string {
  const formattedPrice = formatNaira(order.price);

  if (order.isRestockRequest) {
    return encodeURIComponent(
      `Hello Elmik Stitches, this item is currently out of stock but I'd like to be notified when it's back:\n\n` +
      `*Item:* ${order.title}\n` +
      `*Size:* ${order.size}\n` +
      (order.color ? `*Color:* ${order.color}\n` : "") +
      `*Price:* ${formattedPrice}\n\n` +
      `Please let me know when it's restocked.`
    );
  }

  return encodeURIComponent(
    `Hello Elmik Stitches, I'd like to order:\n\n` +
    `*Item:* ${order.title}\n` +
    `*Size:* ${order.size}\n` +
    (order.color ? `*Color:* ${order.color}\n` : "") +
    `*Price:* ${formattedPrice}\n\n` +
    `Please confirm availability.`
  );
}

/**
 * Generates the complete wa.me deep link with balanced phone number and encoded message.
 */
export async function getWhatsAppOrderUrl(order: OrderDetails): Promise<string> {
  const number = await getNextWhatsAppNumber();
  const message = buildWhatsAppMessage(order);
  return `https://wa.me/${number}?text=${message}`;
}
