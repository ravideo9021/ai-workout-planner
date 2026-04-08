import { NextRequest, NextResponse } from 'next/server';
import { requireRole } from '../../../../lib/server/auth';
import { getDataRepository } from '../../../../lib/server/repository';
import { UserRole } from '../../../../lib/server/types';

const roles: UserRole[] = ['athlete', 'coach', 'admin'];

export async function POST(req: NextRequest) {
  const gate = await requireRole(['admin']);
  if (!gate.ok) return NextResponse.json({ error: gate.message }, { status: gate.status });

  const body = await req.json();
  const userId = String(body?.userId || '').trim();
  const role = String(body?.role || '').trim() as UserRole;

  if (!userId || !roles.includes(role)) {
    return NextResponse.json({ error: 'userId and valid role are required.' }, { status: 400 });
  }

  const repo = getDataRepository();
  await repo.updateUserRole(userId, role);
  return NextResponse.json({ ok: true });
}
