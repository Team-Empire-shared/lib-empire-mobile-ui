/**
 * Hook for optimistic mutations — applies change instantly,
 * enqueues for sync, rolls back on failure.
 */
import { useState, useCallback } from "react";
import { enqueueAction, type QueuedAction } from "../lib/offline-queue";
import NetInfo from "@react-native-community/netinfo";

interface UseOptimisticMutationOptions<TData, TVariables> {
  mutationFn: (variables: TVariables) => Promise<TData>;
  onOptimisticUpdate?: (variables: TVariables) => void;
  onRollback?: (variables: TVariables) => void;
  onSuccess?: (data: TData, variables: TVariables) => void;
  onError?: (error: Error, variables: TVariables) => void;
  offlineAction?: Omit<QueuedAction, "id" | "createdAt">;
}

export function useOptimisticMutation<
  TData = unknown,
  TVariables = unknown,
>({
  mutationFn,
  onOptimisticUpdate,
  onRollback,
  onSuccess,
  onError,
  offlineAction,
}: UseOptimisticMutationOptions<TData, TVariables>) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const mutate = useCallback(
    async (variables: TVariables) => {
      setIsLoading(true);
      setError(null);

      // Apply optimistic update immediately
      onOptimisticUpdate?.(variables);

      const netState = await NetInfo.fetch();
      if (!netState.isConnected && offlineAction) {
        // Offline — enqueue for later sync
        await enqueueAction(offlineAction);
        setIsLoading(false);
        return;
      }

      try {
        const result = await mutationFn(variables);
        onSuccess?.(result, variables);
      } catch (err) {
        const error = err instanceof Error ? err : new Error(String(err));
        setError(error);
        onRollback?.(variables);
        onError?.(error, variables);
      } finally {
        setIsLoading(false);
      }
    },
    [mutationFn, onOptimisticUpdate, onRollback, onSuccess, onError, offlineAction]
  );

  return { mutate, isLoading, error };
}
