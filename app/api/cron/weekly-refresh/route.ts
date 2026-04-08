import { NextRequest, NextResponse } from 'next/server';
import { verifyCronRequest } from '../../../lib/server/jobs/cronAuth';
import { runWeeklyRefreshJob } from '../../../lib/server/jobs/aiJobs';

export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  const unauthorized = verifyCronRequest(req);
  if (unauthorized) return unauthorized;

  try {
    const result = await runWeeklyRefreshJob();
    return NextResponse.json({ ok: true, ...result, ranAt: new Date().toISOString() });
  } catch (error) {
    console.error('weekly-refresh-error', error);
    return NextResponse.json({ error: 'Weekly refresh failed.' }, { status: 500 });
  }
}
