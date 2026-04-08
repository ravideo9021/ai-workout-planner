import { runAIPipeline } from '../ai/pipeline/aiPlanner';
import { UserDataRecord } from './types';

const ONE_WEEK_MS = 7 * 24 * 60 * 60 * 1000;

export const shouldRegenerateWeekly = (record: UserDataRecord) => {
  if (!record.preferences) return false;
  if (!record.planGeneratedAt) return true;
  const age = Date.now() - new Date(record.planGeneratedAt).getTime();
  return age >= ONE_WEEK_MS;
};

export const regeneratePlanForRecord = async (record: UserDataRecord) => {
  if (!record.preferences) return null;
  const { plan, meta, insights } = await runAIPipeline(record.preferences, record.workoutHistory);

  record.plan = plan;
  record.generationMeta = meta;
  record.aiInsights = insights;
  record.planGeneratedAt = new Date().toISOString();
  record.updatedAt = new Date().toISOString();

  return { plan, meta, insights };
};
