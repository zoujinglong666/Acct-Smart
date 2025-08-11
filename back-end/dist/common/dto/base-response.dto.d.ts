export declare class BaseResponse<T> {
    code: number;
    data: T;
    message: string;
    timestamp: string;
    constructor(code: number, data: T, message: string);
    static success<T>(data: T, message?: string): BaseResponse<T>;
    static error<T = null>(code: number, message: string): BaseResponse<T>;
}
