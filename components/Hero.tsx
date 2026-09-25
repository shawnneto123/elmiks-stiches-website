import Link from "next/link";
import Image from "next/image";

interface HeroFloatingCard {
  id: string;
  title: string;
  tag: string;
  src: string;
  alt: string;
  href: string;
  desktopLayoutClass: string;
  driftClass: string;
  sizes: string;
  priority?: boolean;
}

const CATEGORY_PILLS = [
  { label: "Gowns", slug: "gowns" },
  { label: "Dresses", slug: "dresses" },
  { label: "Tops", slug: "tops" },
  { label: "Two-Piece", slug: "two-piece" },
] as const;

const FLOATING_CARDS: readonly HeroFloatingCard[] = [
  {
    id: "hero-card-1",
    title: "Royale Silk Gown",
    tag: "Haute Couture",
    src: "https://images.unsplash.com/photo-1566174053879-31528523f8ae?auto=format&fit=crop&w=1000&q=85",
    alt: "Elmik Stitches Emerald Silk Evening Gown",
    href: "/shop/gowns",
    desktopLayoutClass:
      "md:left-2 lg:left-4 xl:left-8 2xl:left-14 md:top-8 lg:top-12 xl:top-16 md:w-36 lg:w-44 xl:w-56 2xl:w-64 md:-rotate-3 md:hover:-rotate-1 z-20",
    driftClass: "animate-float-drift-1",
    sizes: "(max-width: 768px) 45vw, (max-width: 1280px) 176px, 256px",
  },
  {
    id: "hero-card-2",
    title: "Aura Drape Silhouette",
    tag: "Ready-To-Wear",
    src: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1000&q=85",
    alt: "Elmik Stitches Luxury Drape Ready-To-Wear Dress",
    href: "/shop/dresses",
    desktopLayoutClass:
      "md:left-4 lg:left-6 xl:left-12 2xl:left-20 md:bottom-8 lg:bottom-10 xl:bottom-14 md:w-32 lg:w-36 xl:w-48 2xl:w-56 md:rotate-2 md:hover:rotate-0 z-10",
    driftClass: "animate-float-drift-2",
    sizes: "(max-width: 768px) 45vw, (max-width: 1280px) 144px, 224px",
  },
  {
    id: "hero-card-3",
    title: "Golden Hour Evening",
    tag: "Statement Piece",
    src: "https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=1000&q=85",
    alt: "Elmik Stitches Haute Couture Statement Gown",
    href: "/shop/gowns",
    desktopLayoutClass:
      "hidden md:block md:right-2 lg:right-4 xl:right-8 2xl:right-14 md:top-8 lg:top-12 xl:top-16 md:w-36 lg:w-44 xl:w-56 2xl:w-64 md:rotate-3 md:hover:rotate-1 z-20",
    driftClass: "animate-float-drift-3",
    sizes: "(max-width: 1280px) 176px, 256px",
  },
  {
    id: "hero-card-4",
    title: "Monarch Velvet Gown",
    tag: "Bespoke Cut",
    src: "https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?auto=format&fit=crop&w=1000&q=85",
    alt: "Elmik Stitches Bespoke Monarch Velvet Gown",
    href: "/shop/dresses",
    desktopLayoutClass:
      "hidden md:block md:right-4 lg:right-6 xl:right-12 2xl:right-20 md:bottom-8 lg:bottom-10 xl:bottom-14 md:w-32 lg:w-36 xl:w-48 2xl:w-56 md:-rotate-2 md:hover:rotate-0 z-10",
    driftClass: "animate-float-drift-4",
    sizes: "(max-width: 1280px) 144px, 224px",
  },
  {
    id: "hero-card-5",
    title: "Sovereign Two-Piece",
    tag: "New Season",
    src: "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=1000&q=85",
    alt: "Elmik Stitches Sovereign Contemporary Two-Piece",
    href: "/shop/two-piece",
    desktopLayoutClass: "hidden",
    driftClass: "animate-float-drift-5",
    sizes: "176px",
  },
] as const;

export function Hero() {
  return (
    <section
      aria-label="Elmik Stitches Hero Showcase"
      className="relative w-full min-h-[620px] md:min-h-[780px] lg:min-h-[860px] overflow-hidden bg-neutral-950 text-white flex flex-col justify-center items-center py-14 sm:py-20 md:py-28 px-4 sm:px-6 md:px-12 select-none"
    >
      {/* 1. Full-Bleed Ambient Fashion Imagery with Cinematic Dark Vignette */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none select-none">
        <Image
          src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=2000&q=80"
          alt="Elmik Stitches High Fashion Runway Backdrop"
          fill
          priority
          sizes="(max-width: 768px) 100vw, (max-width: 1536px) 100vw, 1920px"
          quality={65}
          className="object-cover object-center opacity-25 dark:opacity-20 scale-105 transition-opacity duration-700"
        />

        {/* Radial Dark Vignette: black/90 at outer edges fading softly to center */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(15,15,18,0.35)_0%,rgba(10,10,12,0.8)_60%,rgba(5,5,8,0.96)_100%)]" />

        {/* Subtle top & bottom edge gradients for seamless blends into navbar & next section */}
        <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-neutral-950 via-neutral-950/60 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 h-36 bg-gradient-to-t from-neutral-950 via-neutral-950/70 to-transparent" />
      </div>

      {/* 2. Central Editorial Focal Point (Typography, Subtitle, CTAs & Category Pills) */}
      <div className="relative z-20 w-full max-w-4xl mx-auto text-center flex flex-col items-center">
        {/* Brand Headline with Metallic Gold Gradient Treatment */}
        <h1 className="font-serif text-3xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold uppercase tracking-[0.16em] sm:tracking-[0.22em] md:tracking-[0.28em] text-transparent bg-clip-text bg-[linear-gradient(to_right,theme(colors.amber.200),theme(colors.yellow.400),theme(colors.amber.300),theme(colors.yellow.500))] drop-shadow-[0_4px_30px_rgba(217,119,6,0.35)] animate-hero-title leading-[1.08] text-center max-w-full">
          ELMIK STITCHES
        </h1>

        {/* Subtitle / Tagline */}
        <p className="mt-3.5 sm:mt-5 text-xs sm:text-sm md:text-base lg:text-lg font-light uppercase tracking-[0.18em] sm:tracking-[0.24em] md:tracking-[0.28em] text-amber-200/90 dark:text-brand-gold-light max-w-2xl mx-auto animate-hero-subtitle text-center">
          Contemporary Elegance, Tailored to Perfection
        </p>

        {/* Primary CTAs */}
        <div className="mt-8 sm:mt-10 flex flex-col sm:flex-row items-center justify-center gap-3.5 sm:gap-5 w-full max-w-md mx-auto animate-hero-cta">
          {/* Shop Collection CTA */}
          <Link
            href="/shop"
            className="group relative w-full sm:w-auto inline-flex items-center justify-center px-8 sm:px-10 py-3.5 sm:py-4 rounded-full bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 hover:from-yellow-300 hover:to-amber-400 text-neutral-950 font-semibold text-xs sm:text-sm uppercase tracking-wider shadow-[0_0_25px_rgba(217,119,6,0.35)] hover:shadow-[0_0_35px_rgba(245,158,11,0.6)] active:scale-[0.98] transition-all duration-300 text-center"
          >
            <span>Shop Collection</span>
            <span
              aria-hidden="true"
              className="ml-2 inline-block transition-transform duration-300 group-hover:translate-x-1"
            >
              →
            </span>
          </Link>

          {/* Request Custom Outfit CTA (Glassmorphism Outline) */}
          <Link
            href="/custom-order"
            className="w-full sm:w-auto inline-flex items-center justify-center px-8 sm:px-10 py-3.5 sm:py-4 rounded-full backdrop-blur-md bg-white/10 hover:bg-white/15 dark:bg-white/5 dark:hover:bg-white/10 text-white border border-amber-200/40 hover:border-amber-300/70 font-medium text-xs sm:text-sm uppercase tracking-wider shadow-sm active:scale-[0.98] transition-all duration-300 text-center"
          >
            Request Custom Outfit
          </Link>
        </div>

        {/* Horizontal Quick-Browse Category Pills */}
        <div className="mt-6 sm:mt-8 flex flex-wrap items-center justify-center gap-2 sm:gap-2.5 animate-hero-pills">
          <span className="text-[11px] uppercase tracking-widest text-amber-200/60 font-medium mr-1 hidden sm:inline-block">
            Quick Browse:
          </span>
          {CATEGORY_PILLS.map((cat) => (
            <Link
              key={cat.slug}
              href={`/shop/${cat.slug}`}
              className="px-4 py-1.5 rounded-full text-xs font-medium tracking-wide text-neutral-200 hover:text-white bg-white/5 hover:bg-white/15 dark:bg-neutral-900/60 dark:hover:bg-neutral-800/80 border border-white/15 hover:border-amber-400/50 backdrop-blur-sm transition-all duration-300 active:scale-95 shadow-2xs whitespace-nowrap"
            >
              {cat.label}
            </Link>
          ))}
        </div>
      </div>

      {/* 3. Floating / Masonry Fashion Image Cards
          - Mobile (< md): stacks vertically into a condensed 2-image collage strip below the pills (zero overflow, collapsed rotations).
          - Desktop (>= md): expands into an asymmetric floating editorial arrangement framing the central text with continuous drift animations & hover lift.
      */}
      <div className="relative z-10 w-full max-w-sm sm:max-w-md mx-auto mt-8 sm:mt-10 grid grid-cols-2 gap-3.5 px-2 md:mt-0 md:max-w-none md:px-0 md:block md:absolute md:inset-0 md:pointer-events-none md:overflow-hidden">
        {FLOATING_CARDS.map((card) => (
          <Link
            key={card.id}
            id={card.id}
            href={card.href}
            className={`group relative md:absolute block aspect-[3/4] rounded-2xl overflow-hidden border border-amber-200/30 dark:border-amber-400/20 shadow-2xl backdrop-blur-[2px] transition-all duration-500 ease-out md:pointer-events-auto hover:scale-105 hover:-translate-y-2 hover:shadow-[0_25px_45px_rgba(0,0,0,0.65)] hover:border-amber-300/60 ${card.desktopLayoutClass} ${card.driftClass}`}
          >
            <Image
              src={card.src}
              alt={card.alt}
              fill
              sizes={card.sizes}
              priority={card.priority}
              className="object-cover object-center transition-transform duration-700 ease-out group-hover:scale-110"
            />

            {/* Subtle Gradient Vignette inside card */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent transition-opacity duration-300 group-hover:opacity-90" />

            {/* Editorial Caption Badge */}
            <div className="absolute inset-x-0 bottom-0 p-3 sm:p-3.5 text-left flex flex-col justify-end">
              <span className="text-[9px] sm:text-[10px] uppercase font-bold tracking-widest text-amber-300 drop-shadow-sm">
                {card.tag}
              </span>
              <span className="text-xs sm:text-sm font-serif font-medium text-white truncate drop-shadow-sm mt-0.5">
                {card.title}
              </span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}

export default Hero;
