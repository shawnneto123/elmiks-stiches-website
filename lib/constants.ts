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
  storeHours: "9:00 AM – 5:30 PM (Mon – Sat)",
  onlineHours: "24/7 Availability via WhatsApp",
  deliveryInfo: "Worldwide delivery + physical store pickup",
  currency: "NGN",
  currencySymbol: "₦",
  phones: [
    { display: "+234 807 551 4345", tel: "+2348075514345", raw: "2348075514345" },
    { display: "+234 803 310 9393", tel: "+2348033109393", raw: "2348033109393" },
  ],
  email: "contact@elmikstitches.com",
} as const;
