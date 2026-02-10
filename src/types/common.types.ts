/** Common shared types used across the entire application */

/** Generic API response wrapper */
export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
}

/** Pagination metadata */
export interface PaginationMeta {
  page: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
}

/** Paginated API response */
export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  meta: PaginationMeta;
}

/** Sort direction */
export type SortDirection = "asc" | "desc";

/** Base filter params */
export interface BaseFilterParams {
  search?: string;
  page?: number;
  pageSize?: number;
  sortBy?: string;
  sortDirection?: SortDirection;
}

/** Generic selectable option (for dropdowns, selects, etc.) */
export interface SelectOption<T = string> {
  label: string;
  value: T;
}

