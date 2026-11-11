import { timingSafeEqual } from 'node:crypto';

import { revalidatePath, revalidateTag } from 'next/cache';
import { NextResponse, type NextRequest } from 'next/server';

import { API_CACHE_TAG } from '@/lib/api';

const isValidSecret = (received: string | null) => {
  const secret = process.env.REVALIDATE_SECRET;
  if (!secret || !received) return false;
  const a = Buffer.from(received);
  const b = Buffer.from(secret);
  return a.length === b.length && timingSafeEqual(a, b);
};

export async function POST(request: NextRequest) {
  if (!isValidSecret(request.headers.get('x-revalidate-secret'))) {
    return NextResponse.json({ revalidated: false }, { status: 401 });
  }
  revalidateTag(API_CACHE_TAG, { expire: 0 });
  revalidatePath('/', 'layout');
  return NextResponse.json({ revalidated: true });
}
