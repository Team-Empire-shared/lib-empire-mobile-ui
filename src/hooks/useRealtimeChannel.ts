/**
 * Hooks to subscribe to a realtime channel and presence with automatic cleanup.
 */
import { useState, useEffect, useRef } from "react";
import type {
  RealtimeEvent,
  RealtimeClient,
  PresenceUser,
} from "../realtime/realtime-client";

export function useRealtimeChannel(
  client: RealtimeClient | null,
  channel: string,
  onEvent: (event: RealtimeEvent) => void
) {
  const handlerRef = useRef(onEvent);
  handlerRef.current = onEvent;

  useEffect(() => {
    if (!client || !channel) return;
    const unsub = client.subscribe(channel, (e) => handlerRef.current(e));
    return unsub;
  }, [client, channel]);
}

export function usePresence(client: RealtimeClient | null): PresenceUser[] {
  const [users, setUsers] = useState<PresenceUser[]>([]);

  useEffect(() => {
    if (!client) return;
    const unsub = client.onPresence(setUsers);
    return unsub;
  }, [client]);

  return users;
}
