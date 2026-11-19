import { NextResponse } from 'next/server';
import { getSessionUser } from '@/lib/auth';
import connectToDatabase from '@/lib/mongoose';
import { UserModel } from '@/models/User';

export async function requireArtisan() {
  const sessionUser = await getSessionUser();
  if (!sessionUser) {
    return {
      authorized: false,
      response: NextResponse.json({ error: 'Authentication required.' }, { status: 401 }),
    };
  }

  await connectToDatabase();
  const artisan = await UserModel.findOne({
    githubId: sessionUser.id,
    role: 'artisan',
  })
    .select('_id name')
    .lean();

  if (!artisan) {
    return {
      authorized: false,
      response: NextResponse.json({ error: 'Artisan access required.' }, { status: 403 }),
    };
  }

  return {
    authorized: true,
    artisanId: artisan._id,
    artisanName: artisan.name,
  } as const;
}
