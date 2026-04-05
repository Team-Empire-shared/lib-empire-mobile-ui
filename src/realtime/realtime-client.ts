/**
 * Premium real-time client with channel subscriptions, presence,
 * and automatic reconnection. Built on top of EmpireWebSocket.
 */

export type RealtimeEvent = {
  type: string;
  channel?: string;
  payload: Record<string, unknown>;
  timestamp?: string;
  senderId?: number;
};

type EventHandler = (event: RealtimeEvent) => void;
type PresenceHandler = (users: PresenceUser[]) => void;

export interface PresenceUser {
  userId: number;
  name: string;
  avatar?: string;
  status: "online" | "away" | "offline";
  lastSeen: number;
}

class RealtimeClient {
  private ws: WebSocket | null = null;
  private channels = new Map<string, Set<EventHandler>>();
  private presenceHandlers = new Set<PresenceHandler>();
  private globalHandlers = new Set<EventHandler>();
  private reconnectTimer: ReturnType<typeof setTimeout> | null = null;
  private heartbeatTimer: ReturnType<typeof setInterval> | null = null;
  private reconnectAttempts = 0;
  private maxReconnectDelay = 30_000;
  private heartbeatInterval = 30_000;
  private intentionalClose = false;
  private _isConnected = false;
  private _presenceUsers: PresenceUser[] = [];
  private getToken: () => Promise<string | null>;
  private baseUrl: string;

  constructor(config: {
    baseUrl: string;
    getToken: () => Promise<string | null>;
  }) {
    this.baseUrl = config.baseUrl;
    this.getToken = config.getToken;
  }

  get isConnected(): boolean {
    return this._isConnected;
  }

  get presenceUsers(): PresenceUser[] {
    return this._presenceUsers;
  }

  async connect(): Promise<void> {
    const token = await this.getToken();
    if (!token) return;

    const wsUrl = this.baseUrl.replace(/^http/, "ws") + "/ws/realtime";

    try {
      this.ws = new WebSocket(wsUrl, [`token.${token}`]);
      this.intentionalClose = false;

      this.ws.onopen = () => {
        this.reconnectAttempts = 0;
        this._isConnected = true;
        this.startHeartbeat();
        this.emit({ type: "connected", payload: {} });
      };

      this.ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data) as RealtimeEvent;
          this.handleMessage(data);
        } catch {
          /* ignore malformed messages */
        }
      };

      this.ws.onclose = () => {
        this._isConnected = false;
        this.stopHeartbeat();
        if (!this.intentionalClose) this.scheduleReconnect();
      };

      this.ws.onerror = () => {
        this._isConnected = false;
      };
    } catch {
      this.scheduleReconnect();
    }
  }

  disconnect(): void {
    this.intentionalClose = true;
    this.stopHeartbeat();
    if (this.reconnectTimer) clearTimeout(this.reconnectTimer);
    this.ws?.close();
    this.ws = null;
    this._isConnected = false;
  }

  /** Subscribe to events on a specific channel */
  subscribe(channel: string, handler: EventHandler): () => void {
    if (!this.channels.has(channel)) {
      this.channels.set(channel, new Set());
      this.send({ type: "subscribe", channel, payload: {} });
    }
    this.channels.get(channel)!.add(handler);

    return () => {
      const handlers = this.channels.get(channel);
      if (handlers) {
        handlers.delete(handler);
        if (handlers.size === 0) {
          this.channels.delete(channel);
          this.send({ type: "unsubscribe", channel, payload: {} });
        }
      }
    };
  }

  /** Subscribe to ALL events */
  onEvent(handler: EventHandler): () => void {
    this.globalHandlers.add(handler);
    return () => {
      this.globalHandlers.delete(handler);
    };
  }

  /** Subscribe to presence updates */
  onPresence(handler: PresenceHandler): () => void {
    this.presenceHandlers.add(handler);
    return () => {
      this.presenceHandlers.delete(handler);
    };
  }

  /** Send a message through the WebSocket */
  send(event: RealtimeEvent): void {
    if (this.ws?.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(event));
    }
  }

  /** Send typing indicator to a channel */
  sendTyping(channel: string): void {
    this.send({ type: "typing", channel, payload: {} });
  }

  private handleMessage(event: RealtimeEvent): void {
    // Handle presence updates
    if (event.type === "presence") {
      this._presenceUsers =
        (event.payload.users as PresenceUser[]) ?? [];
      this.presenceHandlers.forEach((h) => h(this._presenceUsers));
      return;
    }

    // Handle pong
    if (event.type === "pong") return;

    // Emit to global handlers
    this.globalHandlers.forEach((h) => h(event));

    // Emit to channel handlers
    if (event.channel) {
      const handlers = this.channels.get(event.channel);
      handlers?.forEach((h) => h(event));
    }
  }

  private emit(event: RealtimeEvent): void {
    this.globalHandlers.forEach((h) => h(event));
  }

  private startHeartbeat(): void {
    this.stopHeartbeat();
    this.heartbeatTimer = setInterval(() => {
      this.send({ type: "ping", payload: {} });
    }, this.heartbeatInterval);
  }

  private stopHeartbeat(): void {
    if (this.heartbeatTimer) {
      clearInterval(this.heartbeatTimer);
      this.heartbeatTimer = null;
    }
  }

  private scheduleReconnect(): void {
    const delay = Math.min(
      1000 * 2 ** this.reconnectAttempts,
      this.maxReconnectDelay
    );
    this.reconnectAttempts++;
    this.reconnectTimer = setTimeout(() => this.connect(), delay);
  }
}

export { RealtimeClient };
