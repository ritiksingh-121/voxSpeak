export class ApiResponseDto<T = any> {
  success: boolean;
  data: T;
  message?: string;
  meta?: Record<string, any>;
  timestamp: string;

  static success<T>(data: T, meta?: Record<string, any>, message?: string): ApiResponseDto<T> {
    return { success: true, data, message, meta, timestamp: new Date().toISOString() };
  }

  static error(message: string, statusCode: number = 400, error?: string): ApiResponseDto<null> {
    return {
      success: false,
      data: null,
      message,
      error,
      timestamp: new Date().toISOString(),
    } as any;
  }
}
