import { ProductCategory, ProductSize } from "./types";

export const CATEGORIES: readonly ProductCategory[] = [
  "Gowns",
  "Dresses",
  "Tops",
  "Two-Piece",
  "Jeans",
  "Skirts",
  "Casual",
] as const;

export const SIZES: readonly ProductSize[] = ["S", "M", "L", "XL", "XXL"] as const;

export const BRAND = {
  name: "Elmik Stitches",
  instagramHandle: "@elmik_stitches",
  instagramUrl: "https://www.instagram.com/elmik_stitches/",
  address: "House 67, 2nd Avenue, Efab City Estate, Jabi, Mbora, FCT, Abuja",
  storeHours: "9:00 AM – 5:30 PM (WAT)",
  onlineHours: "24/7",
  deliveryInfo: "Worldwide delivery + physical store pickup",
  currency: "NGN",
  currencySymbol: "₦",
} as const;
