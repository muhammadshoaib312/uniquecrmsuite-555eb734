// Shared API contracts used by the service layer.
// Kept intentionally close to the shape a REST/FastAPI backend would return
// so that the switch from localStorage → HTTP is a drop-in change.

export interface ApiError {
  message: string;
  code?: string;
  status?: number;
  details?: unknown;
}

export interface ApiResponse<T> {
  data: T;
  error?: ApiError;
}

export interface ListParams {
  query?: string;
  page?: number;
  pageSize?: number;
  sort?: string;
  filters?: Record<string, unknown>;
}
