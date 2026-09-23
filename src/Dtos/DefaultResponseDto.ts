export interface DefaultResponseDto<T> {
  success: boolean
  code?: string
  message: string
  result: T | null
}

export interface ValidationResultDto<T> {
  errors: { [key in keyof T]: string[] }
}
