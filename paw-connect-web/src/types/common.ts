export interface SelectOption {
  label: string;
  value: string;
}

export interface PaginatedResponse<T> {
  success: true;
  data: T[];
  total: number;
  page: number;
  limit: number;
}
