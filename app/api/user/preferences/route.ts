import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '../../../lib/server/auth';
import { getDataRepository } from '../../../lib/server/repository';

export async function GET() {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const repo = getDataRepository();
  const record = await repo.getUserData(user.id);
  return NextResponse.json({ preferences: record.preferences });
}

export async function POST(req: NextRequest) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await req.json();
  const preferences = body?.preferences;
  if (!preferences) return NextResponse.json({ error: 'Missing preferences' }, { status: 400 });

  const repo = getDataRepository();
  const record = await repo.getUserData(user.id);
  record.preferences = preferences;
  record.updatedAt = new Date().toISOString();
  await repo.saveUserData(record);

  return NextResponse.json({ ok: true, preferences: record.preferences });
}
