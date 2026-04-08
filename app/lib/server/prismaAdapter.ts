import { AIInsight, WorkoutGenerationMeta, WorkoutLog, WorkoutPlan, UserPreferences } from '../../types/workoutTypes';
import { DataRepository } from './repository';
import { UserDataRecord, UserRecord, UserRole } from './types';

const safeJsonParse = <T>(value: unknown, fallback: T): T => {
  if (value === null || value === undefined) return fallback;
  if (typeof value === 'string') {
    try {
      return JSON.parse(value) as T;
    } catch {
      return fallback;
    }
  }
  return value as T;
};

export class PrismaRepository implements DataRepository {
  private prisma: any;

  constructor(prismaClient: any) {
    this.prisma = prismaClient;
  }

  async findUserByEmail(email: string): Promise<UserRecord | null> {
    const row = await this.prisma.user.findUnique({ where: { email } });
    return row ? this.mapUser(row) : null;
  }

  async findUserById(userId: string): Promise<UserRecord | null> {
    const row = await this.prisma.user.findUnique({ where: { id: userId } });
    return row ? this.mapUser(row) : null;
  }

  async createUser(user: UserRecord): Promise<void> {
    await this.prisma.user.create({
      data: {
        id: user.id,
        name: user.name,
        email: user.email,
        passwordHash: user.passwordHash,
        role: user.role,
        createdAt: new Date(user.createdAt)
      }
    });
  }

  async listUsers(): Promise<UserRecord[]> {
    const rows = await this.prisma.user.findMany({ orderBy: { createdAt: 'desc' } });
    return rows.map((row: any) => this.mapUser(row));
  }

  async upsertSession(session: { token: string; userId: string; expiresAt: string; createdAt: string }): Promise<void> {
    await this.prisma.session.upsert({
      where: { token: session.token },
      update: {
        userId: session.userId,
        expiresAt: new Date(session.expiresAt),
        createdAt: new Date(session.createdAt)
      },
      create: {
        token: session.token,
        userId: session.userId,
        expiresAt: new Date(session.expiresAt),
        createdAt: new Date(session.createdAt)
      }
    });
  }

  async findSessionByToken(token: string): Promise<{ token: string; userId: string; expiresAt: string; createdAt: string } | null> {
    const row = await this.prisma.session.findUnique({ where: { token } });
    if (!row) return null;
    return {
      token: row.token,
      userId: row.userId,
      expiresAt: row.expiresAt.toISOString(),
      createdAt: row.createdAt.toISOString()
    };
  }

  async deleteSession(token: string): Promise<void> {
    await this.prisma.session.deleteMany({ where: { token } });
  }

  async deleteExpiredSessions(): Promise<void> {
    await this.prisma.session.deleteMany({ where: { expiresAt: { lte: new Date() } } });
  }

  async getUserData(userId: string): Promise<UserDataRecord> {
    const row = await this.prisma.userState.findUnique({ where: { userId } });
    if (!row) {
      const created = await this.prisma.userState.create({
        data: {
          userId,
          preferences: null,
          plan: null,
          workoutHistory: [],
          generationMeta: null,
          aiInsights: [],
          planGeneratedAt: null
        }
      });
      return this.mapUserState(created);
    }
    return this.mapUserState(row);
  }

  async saveUserData(record: UserDataRecord): Promise<void> {
    await this.prisma.userState.upsert({
      where: { userId: record.userId },
      update: {
        preferences: record.preferences,
        plan: record.plan,
        workoutHistory: record.workoutHistory,
        generationMeta: record.generationMeta,
        aiInsights: record.aiInsights,
        planGeneratedAt: record.planGeneratedAt ? new Date(record.planGeneratedAt) : null,
        updatedAt: new Date(record.updatedAt)
      },
      create: {
        userId: record.userId,
        preferences: record.preferences,
        plan: record.plan,
        workoutHistory: record.workoutHistory,
        generationMeta: record.generationMeta,
        aiInsights: record.aiInsights,
        planGeneratedAt: record.planGeneratedAt ? new Date(record.planGeneratedAt) : null,
        updatedAt: new Date(record.updatedAt)
      }
    });
  }

  async listUserData(): Promise<UserDataRecord[]> {
    const rows = await this.prisma.userState.findMany({ orderBy: { updatedAt: 'desc' } });
    return rows.map((row: any) => this.mapUserState(row));
  }

  async updateUserRole(userId: string, role: UserRole): Promise<void> {
    await this.prisma.user.update({ where: { id: userId }, data: { role } });
  }

  private mapUser(row: any): UserRecord {
    return {
      id: row.id,
      name: row.name,
      email: row.email,
      passwordHash: row.passwordHash,
      role: row.role as UserRole,
      createdAt: new Date(row.createdAt).toISOString()
    };
  }

  private mapUserState(row: any): UserDataRecord {
    return {
      userId: row.userId,
      preferences: safeJsonParse<UserPreferences | null>(row.preferences, null),
      plan: safeJsonParse<WorkoutPlan | null>(row.plan, null),
      workoutHistory: safeJsonParse<WorkoutLog[]>(row.workoutHistory, []),
      generationMeta: safeJsonParse<WorkoutGenerationMeta | null>(row.generationMeta, null),
      aiInsights: safeJsonParse<AIInsight[]>(row.aiInsights, []),
      planGeneratedAt: row.planGeneratedAt ? new Date(row.planGeneratedAt).toISOString() : null,
      updatedAt: new Date(row.updatedAt).toISOString()
    };
  }
}
