import { NextRequest, NextResponse } from 'next/server';
import { createSession, sanitizeUser, verifyPassword } from '../../../lib/server/auth';
import { getDataRepository } from '../../../lib/server/repository';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const email = String(body?.email || '').trim().toLowerCase();
    const password = String(body?.password || '');

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required.' }, { status: 400 });
    }

    const repo = getDataRepository();
    const user = await repo.findUserByEmail(email);
    if (!user || !verifyPassword(password, user.passwordHash)) {
      return NextResponse.json({ error: 'Invalid credentials.' }, { status: 401 });
    }

    await createSession(user);
    return NextResponse.json({ user: sanitizeUser(user) });
  } catch (error) {
    console.error('login-error', error);
    return NextResponse.json({ error: 'Unable to sign in.' }, { status: 500 });
  }
}
