import crypto from 'crypto';
import { cookies } from 'next/headers';
import { getDataRepository } from './repository';
import { UserRecord, UserRole } from './types';

const SESSION_COOKIE = 'awp_session';
const SESSION_DAYS = 14;

const getAuthSecret = () => process.env.AUTH_SECRET || 'dev-insecure-secret-change-me';

export const hashPassword = (password: string): string => {
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = crypto.pbkdf2Sync(password, salt, 120000, 64, 'sha512').toString('hex');
  return `${salt}:${hash}`;
};

export const verifyPassword = (password: string, stored: string): boolean => {
  const [salt, hash] = stored.split(':');
  if (!salt || !hash) return false;
  const computed = crypto.pbkdf2Sync(password, salt, 120000, 64, 'sha512').toString('hex');
  return crypto.timingSafeEqual(Buffer.from(hash), Buffer.from(computed));
};

const signToken = (payload: string): string => {
  const mac = crypto.createHmac('sha256', getAuthSecret()).update(payload).digest('hex');
  return `${payload}.${mac}`;
};

const verifyToken = (token: string): string | null => {
  const idx = token.lastIndexOf('.');
  if (idx === -1) return null;
  const payload = token.slice(0, idx);
  const signature = token.slice(idx + 1);
  const expected = crypto.createHmac('sha256', getAuthSecret()).update(payload).digest('hex');
  if (!crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expected))) return null;
  return payload;
};

const inferRole = (email: string): UserRole => {
  const adminEmails = (process.env.ADMIN_EMAILS || '')
    .split(',')
    .map((s) => s.trim().toLowerCase())
    .filter(Boolean);
  const coachEmails = (process.env.COACH_EMAILS || '')
    .split(',')
    .map((s) => s.trim().toLowerCase())
    .filter(Boolean);

  if (adminEmails.includes(email)) return 'admin';
  if (coachEmails.includes(email)) return 'coach';
  return 'athlete';
};

export const createUserRecord = (input: {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  createdAt: string;
}): UserRecord => {
  return {
    ...input,
    role: inferRole(input.email)
  };
};

export const createSession = async (user: UserRecord) => {
  const repo = getDataRepository();
  const rawPayload = `${user.id}.${Date.now()}.${crypto.randomBytes(12).toString('hex')}`;
  const token = signToken(rawPayload);
  const expiresAt = new Date(Date.now() + SESSION_DAYS * 24 * 60 * 60 * 1000).toISOString();

  await repo.deleteExpiredSessions();
  await repo.upsertSession({ token, userId: user.id, expiresAt, createdAt: new Date().toISOString() });

  cookies().set(SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    expires: new Date(expiresAt)
  });
};

export const clearSession = async () => {
  const token = cookies().get(SESSION_COOKIE)?.value;
  if (token) {
    const repo = getDataRepository();
    await repo.deleteSession(token);
  }
  cookies().set(SESSION_COOKIE, '', { httpOnly: true, path: '/', expires: new Date(0) });
};

export const getCurrentUser = async (): Promise<UserRecord | null> => {
  const token = cookies().get(SESSION_COOKIE)?.value;
  if (!token) return null;

  const payload = verifyToken(token);
  if (!payload) return null;

  const repo = getDataRepository();
  const session = await repo.findSessionByToken(token);
  if (!session) return null;

  if (new Date(session.expiresAt).getTime() <= Date.now()) {
    await repo.deleteSession(token);
    return null;
  }

  return repo.findUserById(session.userId);
};

export const requireRole = async (roles: UserRole[]) => {
  const user = await getCurrentUser();
  if (!user) return { ok: false as const, status: 401, message: 'Unauthorized' };
  if (!roles.includes(user.role)) return { ok: false as const, status: 403, message: 'Forbidden' };
  return { ok: true as const, user };
};

export const sanitizeUser = (user: UserRecord) => ({
  id: user.id,
  name: user.name,
  email: user.email,
  role: user.role,
  createdAt: user.createdAt
});
