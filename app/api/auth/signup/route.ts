import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { createSession, createUserRecord, hashPassword, sanitizeUser } from '../../../lib/server/auth';
import { getDataRepository } from '../../../lib/server/repository';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const name = String(body?.name || '').trim();
    const email = String(body?.email || '').trim().toLowerCase();
    const password = String(body?.password || '');

    if (name.length < 2) return NextResponse.json({ error: 'Name must be at least 2 characters.' }, { status: 400 });
    if (!email.includes('@')) return NextResponse.json({ error: 'Valid email is required.' }, { status: 400 });
    if (password.length < 8) return NextResponse.json({ error: 'Password must be at least 8 characters.' }, { status: 400 });

    const repo = getDataRepository();
    const exists = await repo.findUserByEmail(email);
    if (exists) return NextResponse.json({ error: 'Email already registered.' }, { status: 409 });

    const user = createUserRecord({
      id: crypto.randomUUID(),
      name,
      email,
      passwordHash: hashPassword(password),
      createdAt: new Date().toISOString()
    });

    await repo.createUser(user);
    await createSession(user);

    return NextResponse.json({ user: sanitizeUser(user) });
  } catch (error) {
    console.error('signup-error', error);
    return NextResponse.json({ error: 'Unable to create account.' }, { status: 500 });
  }
}
