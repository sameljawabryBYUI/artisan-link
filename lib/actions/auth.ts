'use server';

import { redirect } from 'next/navigation';
import { deleteSession } from '@/lib/session';

/** Signs the artisan out and returns them to the home page. */
export async function signOut() {
  await deleteSession();
  redirect('/');
}
