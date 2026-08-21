import type { TrainingResult, TrainingSession } from '@/types/training';

const STORAGE_KEY = 'nmt-math-trainer-history';

const MAX_HISTORY_ITEMS = 50;

export interface TrainingHistoryItem {
  id: string;

  courseId: string;

  startedAt: number;

  finishedAt: number;

  settings: TrainingSession['settings'];

  result: TrainingResult;
}

function canUseStorage(): boolean {
  return (
    typeof window !== 'undefined' && typeof window.localStorage !== 'undefined'
  );
}

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function isValidHistoryItem(value: unknown): value is TrainingHistoryItem {
  if (!isObject(value)) {
    return false;
  }

  return (
    typeof value.id === 'string' &&
    typeof value.courseId === 'string' &&
    typeof value.startedAt === 'number' &&
    typeof value.finishedAt === 'number' &&
    isObject(value.settings) &&
    isObject(value.result)
  );
}

export function loadTrainingHistory(): TrainingHistoryItem[] {
  if (!canUseStorage()) {
    return [];
  }

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);

    if (!raw) {
      return [];
    }

    const parsed: unknown = JSON.parse(raw);

    if (!Array.isArray(parsed)) {
      return [];
    }

    return parsed.filter(isValidHistoryItem);
  } catch {
    return [];
  }
}

export function saveTrainingHistory(history: TrainingHistoryItem[]): void {
  if (!canUseStorage()) {
    return;
  }

  const trimmed = history.slice(0, MAX_HISTORY_ITEMS);

  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(trimmed));
  } catch {
    // localStorage може бути недоступним
    // або переповненим.
  }
}

export function addTrainingHistoryItem(
  item: TrainingHistoryItem,
): TrainingHistoryItem[] {
  const history = loadTrainingHistory();

  const next = [
    item,

    ...history.filter((existing) => existing.id !== item.id),
  ].slice(0, MAX_HISTORY_ITEMS);

  saveTrainingHistory(next);

  return next;
}

export function clearTrainingHistory(): void {
  if (!canUseStorage()) {
    return;
  }

  try {
    window.localStorage.removeItem(STORAGE_KEY);
  } catch {}
}
