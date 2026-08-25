# WhatsApp Round-Robin — Manual Test Plan

This document describes how to verify that the WhatsApp round-robin routing works correctly.

## Prerequisites

1. Run the dev server: `npm run dev`
2. Ensure the `whatsapp_router` table in Supabase has been seeded (single row, `id=1`, `last_index=0`)
3. Open the site in a browser at `http://localhost:3000`

## Test 1: Strict Alternation (5 Sequential Orders)

### Steps

1. Open browser DevTools → Application → Local Storage → clear `elmik_last_wa_index` key (reset state)
2. Navigate to any in-stock product at `/product/[id]`
3. Select a size (and color, if available)
4. Click "Order via WhatsApp" — note which WhatsApp number appears in the `wa.me` URL
5. Repeat steps 2–4 four more times (total 5 clicks)

### Expected Result

| Click | Expected Number         | wa.me URL Contains       |
|-------|------------------------|--------------------------|
| 1     | 2348075514345 (Line A) | `wa.me/2348075514345`    |
| 2     | 2348033109393 (Line B) | `wa.me/2348033109393`    |
| 3     | 2348075514345 (Line A) | `wa.me/2348075514345`    |
| 4     | 2348033109393 (Line B) | `wa.me/2348033109393`    |
| 5     | 2348075514345 (Line A) | `wa.me/2348075514345`    |

The pattern must be strictly A → B → A → B → A. Any deviation is a bug.

## Test 2: Global Fairness via Supabase RPC

### Steps

1. Open the Supabase Dashboard → SQL Editor
2. Run: `SELECT last_index FROM whatsapp_router WHERE id = 1;`
3. Note the current value
4. Click "Order via WhatsApp" on the website
5. Re-run the SQL query — `last_index` should have flipped (0 → 1, or 1 → 0)
6. The wa.me URL should contain the number corresponding to the **new** `last_index`

### Expected Result

The `last_index` value in Supabase flips atomically on each order click, confirming global cross-device fairness.

## Test 3: localStorage Fallback

### Steps

1. Open browser DevTools → Network → throttle to "Offline" (simulate network failure)
2. Click "Order via WhatsApp" — it should still work, falling back to localStorage alternation
3. Check DevTools → Application → Local Storage → `elmik_last_wa_index` is being updated

### Expected Result

Orders continue to alternate correctly via localStorage when the Supabase RPC is unreachable.

## Test 4: Validation Gating

### Steps

1. Navigate to a product detail page
2. Click "Order via WhatsApp" WITHOUT selecting a size
3. Verify inline validation error: "Please select a size before ordering."
4. If the product has colors, select a size but NOT a color — click again
5. Verify inline validation error: "Please select a color before ordering."
6. Select both size and color — click again
7. Verify the WhatsApp link opens successfully

### Expected Result

The Order button is disabled (`disabled` attribute) until both size and color (if applicable) are selected. Clicking the wrapper `div` without valid selections shows an inline validation message.

## Test 5: Restock CTA (Out-of-Stock Products)

### Steps

1. In Supabase, set a product's `in_stock` to `false`
2. Navigate to that product's detail page
3. Verify the button reads "Request Restock via WhatsApp" in outline/ghost style
4. Select size and color, click the button
5. Verify the WhatsApp message starts with: "Hello Elmik Stitches, this item is currently out of stock..."

### Expected Result

Out-of-stock products show a distinct outline-styled CTA that routes to a restock-specific WhatsApp message. The CTA is never fully dead/disabled.

## Test 6: Message Format Verification

### Steps

1. Click "Order via WhatsApp" for any in-stock product
2. Copy the generated `wa.me` URL and decode the `text` query parameter
3. Verify the decoded message contains:
   - `*Item:*` with the product title
   - `*Size:*` with the selected size
   - `*Color:*` with the selected color (if applicable)
   - `*Price:*` formatted as ₦XX,XXX
   - No emojis
   - Proper line breaks (`\n`)

### Expected Result

The message renders cleanly on both iOS and Android WhatsApp with bold `*text*` formatting, no emojis, and correct URL encoding.
