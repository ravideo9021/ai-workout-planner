import { runAIPipeline } from '../../ai/pipeline/aiPlanner';
import { getDataRepository } from '../repository';
import { regeneratePlanForRecord, shouldRegenerateWeekly } from '../autoPlanner';

export const runNightlyRescoreJob = async () => {
  const repo = getDataRepository();
  const allRecords = await repo.listUserData();

  let rescored = 0;
  for (const record of allRecords) {
    if (!record.preferences) continue;
    const { meta, insights } = await runAIPipeline(record.preferences, record.workoutHistory);
    record.generationMeta = meta;
    record.aiInsights = insights;
    record.updatedAt = new Date().toISOString();
    await repo.saveUserData(record);
    rescored += 1;
  }

  return { rescored, total: allRecords.length };
};

export const runWeeklyRefreshJob = async () => {
  const repo = getDataRepository();
  const allRecords = await repo.listUserData();

  let refreshed = 0;
  for (const record of allRecords) {
    if (!record.preferences) continue;
    if (!shouldRegenerateWeekly(record)) continue;
    await regeneratePlanForRecord(record);
    await repo.saveUserData(record);
    refreshed += 1;
  }

  return { refreshed, total: allRecords.length };
};
