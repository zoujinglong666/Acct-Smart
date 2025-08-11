"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseResponse = void 0;
class BaseResponse {
    constructor(code, data, message) {
        this.code = code;
        this.data = data;
        this.message = message;
        this.timestamp = new Date().toISOString();
    }
    static success(data, message = 'ok') {
        return new BaseResponse(0, data, message);
    }
    static error(code, message) {
        return new BaseResponse(code, null, message);
    }
}
exports.BaseResponse = BaseResponse;
//# sourceMappingURL=base-response.dto.js.map