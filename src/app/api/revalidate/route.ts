import { timingSafeEqual } from 'node:crypto';

import { revalidatePath } from 'next/cache';
import { NextResponse, type NextRequest } from 'next/server';

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
  revalidatePath('/', 'layout');
  return NextResponse.json({ revalidated: true });
}
