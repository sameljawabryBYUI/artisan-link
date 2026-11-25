import Link from 'next/link';

export default function AccountHeader() {
  return (
    <header className="border-b border-stone-200/80 bg-[#faf8f3]">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-5 px-6 py-5 sm:px-10">
        <Link href="/" className="font-serif text-2xl font-semibold tracking-tight text-[#173d34]">
          ArtisanLink
        </Link>
        <nav className="flex items-center gap-5 text-sm font-medium text-stone-600">
          <Link className="transition hover:text-[#173d34]" href="/">
            Discover
          </Link>
          <Link className="transition hover:text-[#173d34]" href="/orders">
            My orders
          </Link>
        </nav>
      </div>
    </header>
  );
}
