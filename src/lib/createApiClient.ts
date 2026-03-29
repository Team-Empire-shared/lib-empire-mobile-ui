/**
 * @empireoe/mobile-ui — createApiClient
 *
 * Shared Axios API client factory for all Empire mobile apps.
 * Extracts the duplicated pattern across 17 apps:
 *   - Bearer token from SecureStore
 *   - Token refresh queue (prevents concurrent refresh storms)
 *   - 401 handling with session expiry callback
 *   - Optional retry on 5xx / network errors
 *
 * Usage in each app's src/lib/api.ts:
 *
 *   import { createApiClient } from "@empireoe/mobile-ui";
 *
 *   const { api, setOnUnauthorized } = createApiClient({
 *     baseURL: process.env.EXPO_PUBLIC_API_BASE_URL!,
 *     tokenKey: "auth_token",
 *     refreshTokenField: "access_token",   // field name in refresh response
 *     refreshEndpoint: "/api/v1/auth/refresh",
 *   });
 *
 *   export default api;
 *   export { setOnUnauthorized };
 */

import axios, {
  type AxiosInstance,
  type InternalAxiosRequestConfig,
} from "axios";
import * as SecureStore from "expo-secure-store";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface ApiClientOptions {
  /** Base URL for the API (e.g. from EXPO_PUBLIC_API_BASE_URL) */
  baseURL: string;

  /** SecureStore key used to store the auth token. Default: "auth_token" */
  tokenKey?: string;

  /** Endpoint path for token refresh. Default: "/api/v1/auth/refresh" */
  refreshEndpoint?: string;

  /** Field name in the refresh response JSON. Default: "access_token" */
  refreshTokenField?: string;

  /** Request timeout in ms. Default: 15000 */
  timeout?: number;

  /** Number of retries on 5xx / network errors. Default: 0 (no retry) */
  retries?: number;

  /** Delay between retries in ms. Default: 1000 */
  retryDelay?: number;

  /** Whether to send current token in refresh request header. Default: true */
  sendTokenOnRefresh?: boolean;
}

export interface ApiClient {
  /** The configured Axios instance */
  api: AxiosInstance;

  /** Register a callback when the session expires (401 after failed refresh) */
  setOnUnauthorized: (fn: () => void) => void;
}

// ---------------------------------------------------------------------------
// Internal types
// ---------------------------------------------------------------------------

interface RetriableConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

interface QueueItem {
  resolve: (token: string) => void;
  reject: (err: unknown) => void;
}

// ---------------------------------------------------------------------------
// Factory
// ---------------------------------------------------------------------------

export function createApiClient(options: ApiClientOptions): ApiClient {
  const {
    baseURL,
    tokenKey = "auth_token",
    refreshEndpoint = "/api/v1/auth/refresh",
    refreshTokenField = "access_token",
    timeout = 15_000,
    retries = 0,
    retryDelay = 1_000,
    sendTokenOnRefresh = true,
  } = options;

  // Session expiry callback
  let _onUnauthorized: (() => void) | null = null;

  function setOnUnauthorized(fn: () => void) {
    _onUnauthorized = fn;
  }

  // Token refresh queue state
  let isRefreshing = false;
  let failedQueue: QueueItem[] = [];

  function processQueue(error: unknown, token: string | null = null) {
    failedQueue.forEach((p) => {
      if (token) p.resolve(token);
      else p.reject(error);
    });
    failedQueue = [];
  }

  // Create Axios instance
  const api = axios.create({
    baseURL,
    timeout,
    headers: { "Content-Type": "application/json" },
  });

  // ── Request interceptor: attach Bearer token ─────────────────────────

  api.interceptors.request.use(async (config) => {
    const token = await SecureStore.getItemAsync(tokenKey);
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  });

  // ── Response interceptor: 401 refresh + optional retry ───────────────

  api.interceptors.response.use(
    (res) => res,
    async (err) => {
      if (!axios.isAxiosError(err)) return Promise.reject(err);
      if (err.code === "ERR_CANCELED") return Promise.reject(err);
      if (err.code === "ECONNABORTED") {
        return Promise.reject(
          Object.assign(err, { isTimeout: true }),
        );
      }

      const originalRequest = err.config as RetriableConfig | undefined;
      if (!originalRequest) return Promise.reject(err);

      // ── 401: attempt token refresh ───────────────────────────────

      if (err.response?.status === 401 && !originalRequest._retry) {
        // Never retry the refresh endpoint itself
        if (originalRequest.url?.includes(refreshEndpoint)) {
          await SecureStore.deleteItemAsync(tokenKey);
          _onUnauthorized?.();
          return Promise.reject(err);
        }

        // Queue if another request is already refreshing
        if (isRefreshing) {
          return new Promise<string>((resolve, reject) => {
            failedQueue.push({ resolve, reject });
          }).then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return api(originalRequest);
          });
        }

        originalRequest._retry = true;
        isRefreshing = true;

        try {
          const headers: Record<string, string> = {};
          if (sendTokenOnRefresh) {
            const currentToken = await SecureStore.getItemAsync(tokenKey);
            if (currentToken) {
              headers.Authorization = `Bearer ${currentToken}`;
            }
          }

          const { data } = await axios.post(
            `${baseURL}${refreshEndpoint}`,
            {},
            { timeout, headers },
          );

          const newToken: string =
            data[refreshTokenField] || data.token || data.access_token;

          if (!newToken) throw new Error("No token in refresh response");

          await SecureStore.setItemAsync(tokenKey, newToken);
          api.defaults.headers.common.Authorization = `Bearer ${newToken}`;
          processQueue(null, newToken);

          originalRequest.headers.Authorization = `Bearer ${newToken}`;
          return api(originalRequest);
        } catch (refreshError) {
          processQueue(refreshError, null);
          await SecureStore.deleteItemAsync(tokenKey);
          _onUnauthorized?.();
          return Promise.reject(refreshError);
        } finally {
          isRefreshing = false;
        }
      }

      // ── 5xx / network retry ──────────────────────────────────────

      if (retries > 0 && err.response && err.response.status >= 500) {
        const attempt = (originalRequest as RetriableConfig & { _retryCount?: number })._retryCount ?? 0;
        if (attempt < retries) {
          (originalRequest as RetriableConfig & { _retryCount?: number })._retryCount = attempt + 1;
          await new Promise((r) => setTimeout(r, retryDelay * (attempt + 1)));
          return api(originalRequest);
        }
      }

      return Promise.reject(err);
    },
  );

  return { api, setOnUnauthorized };
}
