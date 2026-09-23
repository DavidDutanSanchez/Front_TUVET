export type PaginationDto<T> = {
  currentPage: number
  pageSize: number
  totalPages: number
  total: number
  data: T[]
}