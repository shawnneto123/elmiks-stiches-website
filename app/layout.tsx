import type { Metadata } from "next";
import { Playfair_Display, Inter } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-serif",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || "https://elmiks-stiches-website.vercel.app"
  ),
  title: {
    default: "Elmik Stitches | Ready-To-Wear & Bespoke Fashion",
    template: "%s | Elmik Stitches",
  },
  description:
    "Discover high-end ready-to-wear pieces and bespoke tailoring from Elmik Stitches, Abuja. Order directly via WhatsApp.",
  icons: {
    icon: [
      { url: "/logo.png", type: "image/png" },
    ],
    apple: [
      { url: "/logo.png", type: "image/png" },
    ],
  },
  openGraph: {
    type: "website",
    siteName: "Elmik Stitches",
    title: "Elmik Stitches | Ready-To-Wear & Bespoke Fashion",
    description:
      "Discover high-end ready-to-wear pieces and bespoke tailoring from Elmik Stitches, Abuja. Order directly via WhatsApp.",
    images: [
      {
        url: "/og-image.svg",
        width: 1200,
        height: 630,
        alt: "Elmik Stitches Collection",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Elmik Stitches | Ready-To-Wear & Bespoke Fashion",
    description:
      "Discover high-end ready-to-wear pieces and bespoke tailoring from Elmik Stitches, Abuja.",
    images: ["/og-image.svg"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${playfair.variable} ${inter.variable} w-full max-w-full overflow-x-hidden`}
    >
      <body className="min-h-screen w-full max-w-full overflow-x-hidden bg-white text-neutral-900 antialiased font-sans flex flex-col">
        <Header />
        <div className="flex-1 w-full max-w-full flex flex-col min-w-0 overflow-x-hidden">
          {children}
        </div>
        <Footer />
      </body>
    </html>
  );
}
