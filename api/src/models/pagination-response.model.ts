export interface PaginationResponse<T> {
  data: T[];
  pagination: {
    page: number;
    totalCount: number;
  };
}
