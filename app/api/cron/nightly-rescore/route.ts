import { NextRequest, NextResponse } from 'next/server';
import { verifyCronRequest } from '../../../lib/server/jobs/cronAuth';
import { runNightlyRescoreJob } from '../../../lib/server/jobs/aiJobs';

export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  const unauthorized = verifyCronRequest(req);
  if (unauthorized) return unauthorized;

  try {
    const result = await runNightlyRescoreJob();
    return NextResponse.json({ ok: true, ...result, ranAt: new Date().toISOString() });
  } catch (error) {
    console.error('nightly-rescore-error', error);
    return NextResponse.json({ error: 'Nightly rescore failed.' }, { status: 500 });
  }
}
