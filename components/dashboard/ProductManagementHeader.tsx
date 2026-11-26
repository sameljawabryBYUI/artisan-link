import Link from 'next/link';

export default function ProductManagementHeader() {
  return (
    <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <p className="mb-2 text-sm font-semibold text-[#24427a]">Your workshop</p>
        <h1 className="font-display text-3xl font-bold tracking-tight text-[#1b2433] sm:text-4xl">
          My products
        </h1>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-[#586274]">
          Keep your handmade pieces up to date and ready for shoppers to discover.
        </p>
      </div>
      <Link
        href="/dashboard/products/new"
        className="inline-flex h-10 shrink-0 items-center justify-center rounded-lg bg-[#24427a] px-4 text-sm font-semibold text-white transition-colors hover:bg-[#1a3360] focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-[#e3a62f]"
      >
        Create product
      </Link>
    </div>
  );
}
