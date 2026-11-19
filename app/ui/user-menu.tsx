'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useCallback, useId, useRef, useState } from 'react';
import { signOut } from '@/lib/actions/auth';
import { useDismiss } from './use-dismiss';

type UserMenuProps = {
  name: string;
  login: string;
  avatarUrl: string;
};

const MENU_LINKS = [
  { href: '/dashboard/products', label: 'My products' },
  { href: '/dashboard/products/new', label: 'Add product' },
  { href: '/orders', label: 'My orders' },
] as const;

/** GitHub avatar button that opens the signed-in menu. */
export function UserMenu({ name, login, avatarUrl }: UserMenuProps) {
  const [open, setOpen] = useState(false);
  const close = useCallback(() => setOpen(false), []);
  const ref = useRef<HTMLDivElement>(null);
  const menuId = useId();
  useDismiss(ref, open, close);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        aria-expanded={open}
        aria-controls={menuId}
        onClick={() => setOpen((value) => !value)}
        className="flex h-10 items-center gap-2 rounded-full py-1 pr-3 pl-1 hover:bg-indigo-tint"
      >
        <Image
          src={avatarUrl}
          alt=""
          width={32}
          height={32}
          className="h-8 w-8 rounded-full border border-line"
        />
        <span className="hidden max-w-40 truncate text-sm font-semibold sm:inline">{name}</span>
        <span className="sr-only">Open account menu</span>
        <svg
          viewBox="0 0 20 20"
          aria-hidden="true"
          className="h-4 w-4 text-muted"
          fill="currentColor"
        >
          <path d="M5.3 7.3a1 1 0 011.4 0L10 10.6l3.3-3.3a1 1 0 111.4 1.4l-4 4a1 1 0 01-1.4 0l-4-4a1 1 0 010-1.4z" />
        </svg>
      </button>

      {open && (
        <div
          id={menuId}
          className="absolute right-0 mt-2 w-60 overflow-hidden rounded-xl border border-line bg-surface shadow-md"
        >
          <div className="border-b border-line px-4 py-3">
            <p className="truncate text-sm font-semibold">{name}</p>
            <p className="truncate text-sm text-muted">@{login}</p>
          </div>
          <ul className="py-1">
            {MENU_LINKS.map(({ href, label }) => (
              <li key={href}>
                <Link
                  href={href}
                  onClick={close}
                  className="flex h-10 items-center px-4 text-sm font-medium hover:bg-indigo-tint"
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>
          <form action={signOut} className="border-t border-line py-1">
            <button
              type="submit"
              className="flex h-10 w-full items-center px-4 text-left text-sm font-medium text-madder hover:bg-indigo-tint"
            >
              Sign out
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
