// Sub-barrel: real-time engine
// Import via: import { ... } from '@empireoe/mobile-ui/realtime'

export {
  RealtimeClient,
  type RealtimeEvent,
  type PresenceUser,
} from "./realtime/realtime-client";
export { useRealtimeChannel, usePresence } from "./hooks/useRealtimeChannel";
