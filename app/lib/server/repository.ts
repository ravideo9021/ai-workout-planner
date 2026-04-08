import { getOrCreateUserData, readDb, writeDb } from './db';
import { AppDatabase, UserDataRecord, UserRecord, UserRole } from './types';
import { PrismaRepository } from './prismaAdapter';

export interface DataRepository {
  findUserByEmail(email: string): Promise<UserRecord | null>;
  findUserById(userId: string): Promise<UserRecord | null>;
  createUser(user: UserRecord): Promise<void>;
  listUsers(): Promise<UserRecord[]>;

  upsertSession(session: { token: string; userId: string; expiresAt: string; createdAt: string }): Promise<void>;
  findSessionByToken(token: string): Promise<{ token: string; userId: string; expiresAt: string; createdAt: string } | null>;
  deleteSession(token: string): Promise<void>;
  deleteExpiredSessions(): Promise<void>;

  getUserData(userId: string): Promise<UserDataRecord>;
  saveUserData(record: UserDataRecord): Promise<void>;
  listUserData(): Promise<UserDataRecord[]>;
  updateUserRole(userId: string, role: UserRole): Promise<void>;
}

class JsonRepository implements DataRepository {
  private normalizeUser(user: UserRecord | undefined | null): UserRecord | null {
    if (!user) return null;
    if (!user.role) user.role = 'athlete';
    return user;
  }

  private async mutate<T>(handler: (db: AppDatabase) => T | Promise<T>): Promise<T> {
    const db = await readDb();
    const result = await handler(db);
    await writeDb(db);
    return result;
  }

  async findUserByEmail(email: string) {
    const db = await readDb();
    return this.normalizeUser(db.users.find((u) => u.email === email) as UserRecord | undefined);
  }

  async findUserById(userId: string) {
    const db = await readDb();
    return this.normalizeUser(db.users.find((u) => u.id === userId) as UserRecord | undefined);
  }

  async createUser(user: UserRecord) {
    await this.mutate((db) => {
      db.users.push(user);
    });
  }

  async listUsers() {
    const db = await readDb();
    return db.users.map((user) => {
      if (!user.role) user.role = 'athlete';
      return user;
    });
  }

  async upsertSession(session: { token: string; userId: string; expiresAt: string; createdAt: string }) {
    await this.mutate((db) => {
      db.sessions = db.sessions.filter((s) => s.token !== session.token && new Date(s.expiresAt).getTime() > Date.now());
      db.sessions.push(session);
    });
  }

  async findSessionByToken(token: string) {
    const db = await readDb();
    return db.sessions.find((s) => s.token === token) || null;
  }

  async deleteSession(token: string) {
    await this.mutate((db) => {
      db.sessions = db.sessions.filter((s) => s.token !== token);
    });
  }

  async deleteExpiredSessions() {
    await this.mutate((db) => {
      db.sessions = db.sessions.filter((s) => new Date(s.expiresAt).getTime() > Date.now());
    });
  }

  async getUserData(userId: string) {
    const db = await readDb();
    const record = getOrCreateUserData(db, userId);
    await writeDb(db);
    return record;
  }

  async saveUserData(record: UserDataRecord) {
    await this.mutate((db) => {
      const index = db.userData.findIndex((u) => u.userId === record.userId);
      if (index >= 0) db.userData[index] = record;
      else db.userData.push(record);
    });
  }

  async listUserData() {
    const db = await readDb();
    // Ensure older records are normalized.
    return db.userData.map((record) => getOrCreateUserData(db, record.userId));
  }

  async updateUserRole(userId: string, role: UserRole) {
    await this.mutate((db) => {
      const user = db.users.find((u) => u.id === userId);
      if (user) user.role = role;
    });
  }
}

class PrismaRepositoryFallback extends JsonRepository {}

export const getDataRepository = (): DataRepository => {
  const backend = (process.env.DATA_BACKEND || 'json').toLowerCase();
  if (backend === 'prisma') {
    try {
      const req = eval('require') as NodeRequire;
      const prismaModule = req('@prisma/client');
      const PrismaClient = prismaModule.PrismaClient;
      if (!PrismaClient) throw new Error('PrismaClient export missing');
      const client = new PrismaClient();
      return new PrismaRepository(client);
    } catch (error) {
      console.warn('DATA_BACKEND=prisma but Prisma client is unavailable, falling back to JSON backend.', error);
      return new PrismaRepositoryFallback();
    }
  }
  return new JsonRepository();
};
