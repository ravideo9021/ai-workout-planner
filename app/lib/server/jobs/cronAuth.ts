import { NextRequest, NextResponse } from 'next/server';

export const verifyCronRequest = (req: NextRequest): NextResponse | null => {
  const header = req.headers.get('x-cron-secret') || req.headers.get('authorization')?.replace('Bearer ', '');
  const expected = process.env.CRON_SECRET;

  if (!expected) {
    return NextResponse.json({ error: 'CRON_SECRET is not configured.' }, { status: 500 });
  }

  if (header !== expected) {
    return NextResponse.json({ error: 'Unauthorized cron request.' }, { status: 401 });
  }

  return null;
};
