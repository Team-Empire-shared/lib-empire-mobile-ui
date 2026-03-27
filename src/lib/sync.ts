import { AppState, type AppStateStatus } from "react-native";
import {
  getQueuedActions,
  dequeueAction,
  type QueuedAction,
} from "./offline-queue";

export type ActionProcessor = (action: QueuedAction) => Promise<boolean>;

let _onSyncComplete: (() => void) | null = null;
let _processAction: ActionProcessor | null = null;

/** Register a callback to be invoked after queued actions are flushed. */
export function setOnSyncComplete(cb: () => void) {
  _onSyncComplete = cb;
}

/** Register the action processor that handles each queued action type. */
export function setActionProcessor(processor: ActionProcessor) {
  _processAction = processor;
}

/** Flush all queued actions. Removes successful ones, keeps failed. */
export async function flushQueue(queueKey?: string): Promise<number> {
  if (!_processAction) return 0;

  const actions = await getQueuedActions(queueKey);
  if (actions.length === 0) return 0;

  let processed = 0;
  for (const action of actions) {
    const ok = await _processAction(action);
    if (ok) {
      await dequeueAction(action.id, queueKey);
      processed++;
    }
  }

  if (processed > 0) {
    _onSyncComplete?.();
  }
  return processed;
}

/** Start listening for app foregrounding to trigger queue flush. */
export function startSyncListener(queueKey?: string): () => void {
  const handleChange = async (state: AppStateStatus) => {
    if (state === "active") {
      await flushQueue(queueKey);
    }
  };

  const subscription = AppState.addEventListener("change", handleChange);
  return () => subscription.remove();
}
