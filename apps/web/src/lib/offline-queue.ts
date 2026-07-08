import { createReport, type ReportPayload } from "@/lib/api-client";

export type QueueStatus = "pending" | "syncing" | "synced" | "failed";

export type QueueItem = {
  id: string;
  local_id: string;
  payload: ReportPayload;
  status: QueueStatus;
  attempts: number;
  last_error?: string;
  created_at: string;
  updated_at: string;
};

const QUEUE_KEY = "radar-report-queue";

function now() {
  return new Date().toISOString();
}

function canUseStorage() {
  return typeof window !== "undefined" && "localStorage" in window;
}

function saveQueue(items: QueueItem[]) {
  if (!canUseStorage()) return;
  window.localStorage.setItem(QUEUE_KEY, JSON.stringify(items));
}

export function getQueue(): QueueItem[] {
  if (!canUseStorage()) return [];
  const raw = window.localStorage.getItem(QUEUE_KEY);
  if (!raw) return [];
  try {
    return JSON.parse(raw) as QueueItem[];
  } catch {
    return [];
  }
}

export function enqueueReport(payload: ReportPayload) {
  const queue = getQueue();
  const localId = payload.localId ?? payload.local_id ?? `local-${Date.now()}`;
  const existing = queue.find((item) => item.local_id === localId && item.status !== "synced");
  if (existing) return existing;
  const item: QueueItem = {
    id: `queue-${Date.now()}`,
    local_id: localId,
    payload: { ...payload, localId, local_id: localId },
    status: "pending",
    attempts: 0,
    created_at: now(),
    updated_at: now()
  };
  saveQueue([item, ...queue]);
  return item;
}

export function getQueueCounts() {
  const queue = getQueue();
  return {
    total: queue.length,
    pending: queue.filter((item) => item.status === "pending").length,
    syncing: queue.filter((item) => item.status === "syncing").length,
    synced: queue.filter((item) => item.status === "synced").length,
    failed: queue.filter((item) => item.status === "failed").length
  };
}

async function syncItem(item: QueueItem) {
  const queue = getQueue();
  saveQueue(queue.map((entry) => (entry.id === item.id ? { ...entry, status: "syncing", updated_at: now() } : entry)));
  try {
    await createReport(item.payload);
    const latest = getQueue();
    saveQueue(
      latest.map((entry) =>
        entry.id === item.id
          ? { ...entry, status: "synced", attempts: entry.attempts + 1, last_error: undefined, updated_at: now() }
          : entry
      )
    );
  } catch (error) {
    const latest = getQueue();
    saveQueue(
      latest.map((entry) =>
        entry.id === item.id
          ? {
              ...entry,
              status: "failed",
              attempts: entry.attempts + 1,
              last_error: error instanceof Error ? error.message : "Gagal sinkronisasi.",
              updated_at: now()
            }
          : entry
      )
    );
  }
}

export async function syncPendingReports() {
  const queue = getQueue().filter((item) => item.status === "pending" || item.status === "failed");
  for (const item of queue) {
    await syncItem(item);
  }
  return getQueue();
}

export async function retryQueueItem(id: string) {
  const item = getQueue().find((entry) => entry.id === id);
  if (!item) return getQueue();
  await syncItem({ ...item, status: "pending" });
  return getQueue();
}

export function deleteQueueItem(id: string) {
  const queue = getQueue().filter((item) => item.id !== id);
  saveQueue(queue);
  return queue;
}
