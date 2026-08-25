import { OrderDetails } from "../types";
import { formatNaira } from "../utils/currency";

// Single Source of Truth for WhatsApp contact numbers
export const WHATSAPP_NUMBERS = ["2348075514345", "2348033109393"] as const; // E.164 format, no leading 0, prefixed with 234
const STORAGE_KEY = "elmik_last_wa_index";

// In-memory fallback for environments where localStorage is unavailable
let memoryLastIndex = -1;

/**
 * Strategy A — Strict alternation via localStorage (default per PRD Section 7).
 * Reads the last-used index, increments modulo 2, persists, and returns the next WhatsApp number.
 */
export function getNextWhatsAppNumber(): string {
  if (typeof window === "undefined") {
    // SSR guard — fallback safely to index 0
    return WHATSAPP_NUMBERS[0];
  }

  try {
    const lastIndexRaw = window.localStorage.getItem(STORAGE_KEY);
    const lastIndex = lastIndexRaw === null ? -1 : parseInt(lastIndexRaw, 10);
    const nextIndex = (lastIndex + 1) % 2;
    window.localStorage.setItem(STORAGE_KEY, String(nextIndex));
    return WHATSAPP_NUMBERS[nextIndex];
  } catch {
    // In-memory fallback if localStorage access is blocked (e.g. private mode restrictions)
    memoryLastIndex = (memoryLastIndex + 1) % 2;
    return WHATSAPP_NUMBERS[memoryLastIndex];
  }
}

/**
 * Formats order or restock inquiries into pre-filled WhatsApp messages.
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
export function getWhatsAppOrderUrl(order: OrderDetails): string {
  const number = getNextWhatsAppNumber();
  const message = buildWhatsAppMessage(order);
  return `https://wa.me/${number}?text=${message}`;
}
