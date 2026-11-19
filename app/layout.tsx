import type { Metadata } from 'next';
import { Bricolage_Grotesque, Figtree } from 'next/font/google';
import { Header } from '@/app/ui/header';
import { Footer } from '@/app/ui/footer';
import './globals.css';

// Display face: headings, logo, hero (design-language.html → Typography).
const bricolage = Bricolage_Grotesque({
  variable: '--font-bricolage',
  subsets: ['latin', 'latin-ext'],
  axes: ['opsz'],
});

// Body face: text, forms, buttons. latin-ext covers accented artisan and country names.
const figtree = Figtree({
  variable: '--font-figtree',
  subsets: ['latin', 'latin-ext'],
});

export const metadata: Metadata = {
  title: {
    default: 'ArtisanLink | Handmade crafts from around the world',
    template: '%s | ArtisanLink',
  },
  description:
    'Discover handmade crafts from local artisans in every country and contact the makers directly.',
};

export default function RootLayout({ children }: LayoutProps<'/'>) {
  return (
    <html lang="en" className={`${bricolage.variable} ${figtree.variable} h-full`}>
      <body className="flex min-h-full flex-col">
        <a
          href="#main"
          className="sr-only rounded-lg bg-ink px-4 py-2 font-semibold text-white focus:not-sr-only focus:absolute focus:top-3 focus:left-3 focus:z-50"
        >
          Skip to content
        </a>
        <Header />
        <div id="main" className="flex flex-1 flex-col">
          {children}
        </div>
        <Footer />
      </body>
    </html>
  );
}
