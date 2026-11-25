import type { CSSProperties, ReactNode } from 'react';
import Image, { type StaticImageData } from 'next/image';
import Link from 'next/link';
import textilesImage from '@/public/images/categories/textiles.webp';
import ceramicsImage from '@/public/images/categories/ceramics.webp';
import woodworkImage from '@/public/images/categories/woodwork.jpg';
import jewelryImage from '@/public/images/categories/jewelry.webp';
import { ProductGrid } from '@/app/ui/product-grid';
import { getFeaturedProducts } from '@/lib/featured-products';

const iconProps = {
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 2,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
  'aria-hidden': true,
  className: 'h-6 w-6',
} as const;

const STEPS: { title: string; text: string; icon: ReactNode }[] = [
  {
    title: 'Browse handmade pieces',
    text: 'Explore textiles, ceramics, woodwork and jewelry made by local artisans in many countries.',
    icon: (
      <svg {...iconProps}>
        <circle cx="11" cy="11" r="7" />
        <path d="M20 20l-3.5-3.5" />
      </svg>
    ),
  },
  {
    title: 'Filter by craft and country',
    text: 'Narrow the catalog to the kind of craft you love, or to the country it comes from.',
    icon: (
      <svg {...iconProps}>
        <path d="M4 6h16M7 12h10M10 18h4" />
      </svg>
    ),
  },
  {
    title: 'Reach the maker',
    text: 'Contact the artisan directly by WhatsApp or email, or place an order for the piece.',
    icon: (
      <svg {...iconProps}>
        <path d="M21 12a8 8 0 01-11.6 7.1L4 20l1-4.6A8 8 0 1121 12z" />
      </svg>
    ),
  },
];

// Category values must match the product filter on /products (FR-005).
const CATEGORIES: {
  slug: string;
  name: string;
  text: string;
  image: StaticImageData;
  /** Keeps the subject in frame when the photo is cropped to the card. */
  focus: string;
}[] = [
  {
    slug: 'textiles',
    name: 'Textiles',
    text: 'Weaving, embroidery, natural dyes',
    image: textilesImage,
    focus: 'object-center',
  },
  {
    slug: 'ceramics',
    name: 'Ceramics',
    text: 'Pottery, tiles, glazed and burnished clay',
    image: ceramicsImage,
    focus: 'object-center',
  },
  {
    slug: 'woodwork',
    name: 'Woodwork',
    text: 'Carving, turning, furniture and toys',
    image: woodworkImage,
    focus: 'object-[65%_50%]',
  },
  {
    slug: 'jewelry',
    name: 'Jewelry',
    text: 'Silver, beads, seeds and found materials',
    image: jewelryImage,
    focus: 'object-center',
  },
];

// Where "Share your craft" goes: sign in first, then the artisan dashboard.
const SELL_HREF = '/login?callbackUrl=/dashboard/products';

const buttonBase =
  'inline-flex h-12 items-center justify-center rounded-lg px-6 font-semibold transition-colors';

export default function HomePage() {
  return (
    <main>
      <HeroSection />
      <FeaturedProducts />
      <HowItWorks />
      <Categories />
      <ArtisanCta />
    </main>
  );
}

function HeroSection() {
  return (
    <section className="border-b border-line bg-surface">
      <div className="container-page grid items-center gap-12 py-16 md:py-24 lg:grid-cols-[1.15fr_1fr]">
        <div className="space-y-6">
          <p className="text-xs font-semibold tracking-wider text-muted uppercase">
            Handmade crafts from local artisans
          </p>
          <h1 className="font-display text-4xl leading-[1.05] font-bold tracking-tight sm:text-5xl lg:text-6xl">
            Handmade, from everywhere.
            <span className="block text-indigo">Straight from the maker.</span>
          </h1>
          <p className="max-w-prose text-lg leading-relaxed text-muted">
            ArtisanLink brings together crafts that usually only sell in local markets. Find a piece
            you love, see who made it, and contact them directly.
          </p>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Link
              href="/products"
              className={`${buttonBase} bg-indigo text-white hover:bg-indigo-dark`}
            >
              Browse crafts
            </Link>
            <Link
              href={SELL_HREF}
              className={`${buttonBase} border border-line-strong bg-surface text-ink hover:bg-indigo-tint`}
            >
              Share your craft
            </Link>
          </div>
        </div>

        <WovenSwatch />
      </div>
    </section>
  );
}

/**
 * Decorative "woven cloth" from the design direction: indigo warp threads,
 * dyed from light to deep, crossed by saffron and cotton weft threads.
 */
function WovenSwatch() {
  const warp = [
    '#e8edf6',
    '#c9d4e8',
    '#9db0d3',
    '#728dbb',
    '#4d6a9e',
    '#36558b',
    '#24427a',
    '#1a3360',
  ];
  const weft = [
    { y: 34, color: 'var(--color-saffron)', height: 10 },
    { y: 92, color: 'var(--color-cotton)', height: 6 },
    { y: 142, color: 'var(--color-saffron)', height: 4 },
    { y: 196, color: 'var(--color-cotton)', height: 10 },
    { y: 252, color: 'var(--color-saffron)', height: 6 },
  ];

  return (
    <div aria-hidden="true" className="hidden justify-self-end lg:block">
      <svg viewBox="0 0 320 288" className="h-auto w-full max-w-md rounded-xl">
        <rect width="320" height="288" fill="var(--color-cotton)" />
        {warp.map((color, i) => (
          <rect key={color} x={i * 40 + 6} y="0" width="28" height="288" rx="3" fill={color} />
        ))}
        {weft.map(({ y, color, height }, row) =>
          warp.map((_, i) =>
            // Over-under weave: each weft row shows on every other warp thread, offset per row.
            (i + row) % 2 === 0 ? (
              <rect
                key={`${y}-${i}`}
                x={i * 40}
                y={y - height / 2}
                width="40"
                height={height}
                fill={color}
              />
            ) : null
          )
        )}
      </svg>
    </div>
  );
}

async function FeaturedProducts() {
  const { products, isSample } = await getFeaturedProducts(4);

  return (
    <section className="container-page pt-12 md:pt-16">
      <div className="space-y-8">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div className="space-y-2">
            <h2 className="font-display text-3xl font-bold tracking-tight">Featured crafts</h2>
            <p className="text-muted">
              {isSample
                ? 'Example listings. Real products from our artisans will appear here.'
                : 'The newest pieces from our artisans.'}
            </p>
          </div>
          <Link href="/products" className="font-semibold text-indigo hover:underline">
            See all products →
          </Link>
        </div>
        <ProductGrid
          products={products}
          columns={4}
          emptyState={
            <div className="flex flex-col items-start gap-3 rounded-xl border border-dashed border-line-strong bg-surface p-6">
              <p className="font-semibold">No products yet</p>
              <p className="text-muted">Be the first artisan to list a craft on ArtisanLink.</p>
              <Link href={SELL_HREF} className="font-semibold text-indigo hover:underline">
                List your craft →
              </Link>
            </div>
          }
        />
      </div>
    </section>
  );
}

function HowItWorks() {
  return (
    <section className="container-page py-12 md:py-16">
      <div className="space-y-8">
        <h2 className="font-display text-3xl font-bold tracking-tight">How ArtisanLink works</h2>
        {/* The dashed line behind the cards (md and up) shows the steps are a sequence. */}
        <ol className="relative grid gap-6 md:grid-cols-3 md:before:absolute md:before:inset-x-[16%] md:before:top-[3.25rem] md:before:border-t-2 md:before:border-dashed md:before:border-line-strong">
          {STEPS.map((step, i) => (
            <li
              key={step.title}
              style={{ '--reveal-offset': `${i * 10}%` } as CSSProperties}
              className="group reveal-on-scroll relative space-y-4 rounded-xl border border-line bg-surface p-6 transition duration-300 hover:-translate-y-1 hover:border-indigo hover:shadow-lg"
            >
              <div className="flex items-center justify-between">
                <span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-indigo-tint text-indigo transition duration-300 group-hover:scale-110 group-hover:bg-indigo group-hover:text-white">
                  {step.icon}
                </span>
                <span className="font-display text-4xl font-bold text-line transition-colors duration-300 group-hover:text-saffron">
                  {i + 1}
                </span>
              </div>
              <h3 className="text-lg font-semibold">{step.title}</h3>
              <p className="leading-relaxed text-muted">{step.text}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

function Categories() {
  return (
    <section className="container-page pb-12 md:pb-16">
      <div className="space-y-8">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <h2 className="font-display text-3xl font-bold tracking-tight">Shop by craft</h2>
          <Link href="/products" className="font-semibold text-indigo hover:underline">
            See all products →
          </Link>
        </div>
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {CATEGORIES.map((category) => (
            <li key={category.slug}>
              <Link
                href={`/products?category=${category.slug}`}
                className="group relative flex aspect-[3/2] overflow-hidden rounded-xl bg-ink sm:aspect-[4/5]"
              >
                {/* Decorative: the category name and description are the link text. */}
                <Image
                  src={category.image}
                  alt=""
                  fill
                  placeholder="blur"
                  sizes="(min-width: 1024px) 270px, (min-width: 640px) 50vw, 100vw"
                  className={`object-cover ${category.focus} transition duration-500 ease-out group-hover:scale-105`}
                />
                {/* Gradient keeps white text readable on any photo. */}
                <div className="absolute inset-0 bg-linear-to-t from-ink/95 via-ink/45 to-ink/5 transition-colors duration-500 group-hover:from-indigo/95 group-hover:via-indigo/50" />
                <div className="relative mt-auto space-y-2 p-6 text-white">
                  <span className="inline-flex w-fit items-center rounded-full bg-surface px-3 py-1 text-xs font-semibold text-indigo">
                    {category.name}
                  </span>
                  <p className="text-white/90">{category.text}</p>
                  <span className="inline-flex items-center gap-1 text-sm font-semibold">
                    Browse {category.name.toLowerCase()}
                    <span
                      aria-hidden="true"
                      className="transition-transform duration-300 group-hover:translate-x-1"
                    >
                      →
                    </span>
                  </span>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

function ArtisanCta() {
  return (
    <section className="bg-indigo text-white">
      <div className="container-page flex flex-col items-start gap-6 py-12 md:flex-row md:items-center md:justify-between md:py-16">
        <div className="max-w-xl space-y-2">
          <h2 className="font-display text-3xl font-bold tracking-tight">Are you an artisan?</h2>
          <p className="leading-relaxed text-indigo-tint">
            Show your work to buyers outside your local market. Sign in with GitHub and list your
            first craft in a few minutes. It&apos;s free.
          </p>
        </div>
        <Link
          href={SELL_HREF}
          className={`${buttonBase} shrink-0 bg-saffron text-ink hover:bg-saffron-tint`}
        >
          Start selling
        </Link>
      </div>
    </section>
  );
}
