'use client';

import Link from 'next/link';
import { useCallback, useId, useRef, useState } from 'react';
import { NAV_LINKS } from './nav-links';
import { useDismiss } from './use-dismiss';

/** Menu button with the main links, shown below the `md` breakpoint. */
export function MobileNav() {
  const [open, setOpen] = useState(false);
  const close = useCallback(() => setOpen(false), []);
  const ref = useRef<HTMLDivElement>(null);
  const panelId = useId();
  useDismiss(ref, open, close);

  return (
    <div ref={ref} className="md:hidden">
      <button
        type="button"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen((value) => !value)}
        className="inline-flex h-10 w-10 items-center justify-center rounded-lg text-ink hover:bg-indigo-tint"
      >
        <span className="sr-only">{open ? 'Close menu' : 'Open menu'}</span>
        <svg viewBox="0 0 24 24" aria-hidden="true" className="h-6 w-6" fill="none">
          {open ? (
            <path
              d="M6 6l12 12M18 6L6 18"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
          ) : (
            <path
              d="M4 7h16M4 12h16M4 17h16"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
          )}
        </svg>
      </button>

      {open && (
        <nav
          id={panelId}
          aria-label="Main"
          className="absolute inset-x-0 top-16 border-b border-line bg-surface shadow-md"
        >
          <ul className="container-page flex flex-col py-2">
            {NAV_LINKS.map(({ href, label }) => (
              <li key={href}>
                <Link
                  href={href}
                  onClick={close}
                  className="flex h-12 items-center rounded-lg px-3 font-semibold text-ink hover:bg-indigo-tint"
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </div>
  );
}
