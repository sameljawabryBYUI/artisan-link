import Link from 'next/link';

/*
 * Home page (/). Fully static: no session or data reads, so it prerenders
 * and loads instantly. Layout follows docs/design-language.html → Layout patterns → Home.
 */

const STEPS = [
  {
    title: 'Browse handmade pieces',
    text: 'Explore textiles, ceramics, woodwork and jewelry made by local artisans in many countries.',
  },
  {
    title: 'Filter by craft and country',
    text: 'Narrow the catalog to the kind of craft you love, or to the country it comes from.',
  },
  {
    title: 'Reach the maker',
    text: 'Contact the artisan directly by WhatsApp or email, or place an order for the piece.',
  },
] as const;

// Category values must match the product filter on /products (FR-005).
const CATEGORIES = [
  { slug: 'textiles', name: 'Textiles', text: 'Weaving, embroidery, natural dyes' },
  { slug: 'ceramics', name: 'Ceramics', text: 'Pottery, tiles, glazed and burnished clay' },
  { slug: 'woodwork', name: 'Woodwork', text: 'Carving, turning, furniture and toys' },
  { slug: 'jewelry', name: 'Jewelry', text: 'Silver, beads, seeds and found materials' },
] as const;

// Where "Share your craft" goes: sign in first, then the artisan dashboard.
const SELL_HREF = '/login?callbackUrl=/dashboard/products';

const buttonBase =
  'inline-flex h-12 items-center justify-center rounded-lg px-6 font-semibold transition-colors';

export default function HomePage() {
  return (
    <main>
      <Hero />
      <HowItWorks />
      <Categories />
      <ArtisanCta />
    </main>
  );
}

function Hero() {
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

function HowItWorks() {
  return (
    <section className="container-page py-12 md:py-16">
      <div className="space-y-8">
        <h2 className="font-display text-3xl font-bold tracking-tight">How ArtisanLink works</h2>
        <ol className="grid gap-6 md:grid-cols-3">
          {STEPS.map((step, i) => (
            <li key={step.title} className="space-y-3 rounded-xl border border-line bg-surface p-6">
              <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-saffron-tint font-display font-bold text-ink">
                {i + 1}
              </span>
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
                className="group flex h-full flex-col gap-2 rounded-xl border border-line bg-surface p-6 transition hover:border-line-strong hover:shadow-md"
              >
                <span className="inline-flex w-fit items-center rounded-full bg-indigo-tint px-3 py-1 text-xs font-semibold text-indigo">
                  {category.name}
                </span>
                <span className="text-muted">{category.text}</span>
                <span className="mt-auto pt-2 text-sm font-semibold text-indigo group-hover:underline">
                  Browse {category.name.toLowerCase()}
                </span>
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
