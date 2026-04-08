import { promises as fs } from 'fs';
import path from 'path';
import { AppDatabase, UserDataRecord } from './types';

const DATA_DIR = path.join(process.cwd(), 'data');
const DB_FILE = path.join(DATA_DIR, 'db.json');

const EMPTY_DB: AppDatabase = {
  users: [],
  userData: [],
  sessions: []
};

let writeQueue: Promise<void> = Promise.resolve();

const ensureDbFile = async () => {
  await fs.mkdir(DATA_DIR, { recursive: true });
  try {
    await fs.access(DB_FILE);
  } catch {
    await fs.writeFile(DB_FILE, JSON.stringify(EMPTY_DB, null, 2), 'utf8');
  }
};

export const readDb = async (): Promise<AppDatabase> => {
  await ensureDbFile();
  const raw = await fs.readFile(DB_FILE, 'utf8');
  try {
    return JSON.parse(raw) as AppDatabase;
  } catch {
    return EMPTY_DB;
  }
};

export const writeDb = async (db: AppDatabase): Promise<void> => {
  await ensureDbFile();
  writeQueue = writeQueue.then(() => fs.writeFile(DB_FILE, JSON.stringify(db, null, 2), 'utf8'));
  await writeQueue;
};

export const getOrCreateUserData = (db: AppDatabase, userId: string): UserDataRecord => {
  let record = db.userData.find((item) => item.userId === userId);
  if (!record) {
    record = {
      userId,
      preferences: null,
      plan: null,
      workoutHistory: [],
      planGeneratedAt: null,
      generationMeta: null,
      aiInsights: [],
      updatedAt: new Date().toISOString()
    };
    db.userData.push(record);
  } else {
    // Backward-compatible shape migration for older local db records.
    if (record.generationMeta === undefined) record.generationMeta = null;
    if (!Array.isArray(record.aiInsights)) record.aiInsights = [];
  }
  return record;
};
