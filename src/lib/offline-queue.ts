import AsyncStorage from "@react-native-async-storage/async-storage";

const DEFAULT_QUEUE_KEY = "empire_offline_queue";

export interface QueuedAction {
  id: string;
  type: string;
  entityId: number | string;
  payload?: Record<string, unknown>;
  createdAt: number;
}

/** Get all queued actions. */
export async function getQueuedActions(
  queueKey = DEFAULT_QUEUE_KEY
): Promise<QueuedAction[]> {
  try {
    const raw = await AsyncStorage.getItem(queueKey);
    return raw ? (JSON.parse(raw) as QueuedAction[]) : [];
  } catch {
    return [];
  }
}

/** Add an action to the offline queue. */
export async function enqueueAction(
  action: Omit<QueuedAction, "id" | "createdAt">,
  queueKey = DEFAULT_QUEUE_KEY
): Promise<void> {
  const queue = await getQueuedActions(queueKey);
  queue.push({
    ...action,
    id: `${action.type}_${action.entityId}_${Date.now()}`,
    createdAt: Date.now(),
  });
  await AsyncStorage.setItem(queueKey, JSON.stringify(queue));
}

/** Remove a specific action from the queue. */
export async function dequeueAction(
  id: string,
  queueKey = DEFAULT_QUEUE_KEY
): Promise<void> {
  const queue = await getQueuedActions(queueKey);
  const filtered = queue.filter((a) => a.id !== id);
  await AsyncStorage.setItem(queueKey, JSON.stringify(filtered));
}

/** Clear the entire queue. */
export async function clearQueue(queueKey = DEFAULT_QUEUE_KEY): Promise<void> {
  await AsyncStorage.removeItem(queueKey);
}

/** Get the count of pending queued actions. */
export async function getQueueCount(
  queueKey = DEFAULT_QUEUE_KEY
): Promise<number> {
  const queue = await getQueuedActions(queueKey);
  return queue.length;
}
