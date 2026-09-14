/**
 * 统一响应格式 - 类似 Java 中的 BaseResponse
 */
export class BaseResponse<T> {
  code: number;
  data: T;
  message: string;
  timestamp: string;

  constructor(code: number, data: T, message: string) {
    this.code = code;
    this.data = data;
    this.message = message;
    this.timestamp = new Date().toISOString();
  }

  /**
   * 成功响应
   */
  static success<T>(data: T, message: string = 'ok'): BaseResponse<T> {
    return new BaseResponse(0, data, message);
  }

  /**
   * 错误响应 - 失败时 data 设置为 null
   */
  static error<T = null>(code: number, message: string): BaseResponse<T> {
    return new BaseResponse(code, null as T, message);
  }
}