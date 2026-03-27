import { getItem } from "./storage";

// ── Types ──────────────────────────────────────────────────────────────

export interface WSMessage {
  type: string;
  signal_id?: string;
  topic?: string;
  payload: Record<string, unknown>;
  occurred_at?: string;
}

type MessageHandler = (msg: WSMessage) => void;

export interface WebSocketClientConfig {
  /** Base API URL — ws:// will be derived from this */
  apiUrl: string;
  /** SecureStore key for the auth token */
  tokenKey: string;
  /** WebSocket path (default: /ws/notifications) */
  wsPath?: string;
  /** Heartbeat timeout in ms (default: 45000) */
  heartbeatTimeout?: number;
  /** Max reconnect delay in ms (default: 30000) */
  maxReconnectDelay?: number;
}

// ── WebSocket Client ────────────────────────────────────────────────────

export class EmpireWebSocket {
  private ws: WebSocket | null = null;
  private handlers: MessageHandler[] = [];
  private reconnectAttempts = 0;
  private reconnectTimer: ReturnType<typeof setTimeout> | null = null;
  private heartbeatTimer: ReturnType<typeof setTimeout> | null = null;
  private intentionalClose = false;
  private _isConnected = false;
  private config: Required<WebSocketClientConfig>;

  constructor(cfg: WebSocketClientConfig) {
    this.config = {
      wsPath: "/ws/notifications",
      heartbeatTimeout: 45000,
      maxReconnectDelay: 30000,
      ...cfg,
    };
  }

  async connect(): Promise<void> {
    const token = await getItem(this.config.tokenKey);
    if (!token) return;

    const baseUrl = this.config.apiUrl.replace(/\/api\/v1$/, "");
    const wsUrl =
      baseUrl.replace(/^http/, "ws") +
      this.config.wsPath +
      "?token=" +
      encodeURIComponent(token);

    try {
      this.ws = new WebSocket(wsUrl);
      this.intentionalClose = false;

      this.ws.onopen = () => {
        this.reconnectAttempts = 0;
        this._isConnected = true;
        this.resetHeartbeat();
        this.notifyHandlers({ type: "connected", payload: {} });
      };

      this.ws.onmessage = (event) => {
        try {
          const msg: WSMessage = JSON.parse(event.data as string);

          if (msg.type === "ping") {
            this.ws?.send(JSON.stringify({ type: "pong" }));
            this.resetHeartbeat();
            return;
          }

          this.resetHeartbeat();
          this.notifyHandlers(msg);
        } catch {
          // ignore parse errors
        }
      };

      this.ws.onclose = () => {
        this._isConnected = false;
        if (!this.intentionalClose) this.scheduleReconnect();
      };

      this.ws.onerror = () => {
        this._isConnected = false;
      };
    } catch {
      this.scheduleReconnect();
    }
  }

  private resetHeartbeat() {
    if (this.heartbeatTimer) clearTimeout(this.heartbeatTimer);
    this.heartbeatTimer = setTimeout(() => {
      this.ws?.close();
    }, this.config.heartbeatTimeout);
  }

  private scheduleReconnect() {
    const delay = Math.min(
      1000 * Math.pow(2, this.reconnectAttempts),
      this.config.maxReconnectDelay
    );
    this.reconnectAttempts++;
    this.reconnectTimer = setTimeout(() => this.connect(), delay);
  }

  private notifyHandlers(msg: WSMessage) {
    for (const h of this.handlers) {
      try {
        h(msg);
      } catch {
        /* handler error */
      }
    }
  }

  disconnect() {
    this.intentionalClose = true;
    this._isConnected = false;
    if (this.heartbeatTimer) clearTimeout(this.heartbeatTimer);
    if (this.reconnectTimer) clearTimeout(this.reconnectTimer);
    this.ws?.close();
    this.ws = null;
  }

  onMessage(handler: MessageHandler): () => void {
    this.handlers.push(handler);
    return () => {
      this.handlers = this.handlers.filter((h) => h !== handler);
    };
  }

  get isConnected() {
    return this._isConnected;
  }
}
