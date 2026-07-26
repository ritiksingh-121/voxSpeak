"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "ApiResponseDto", {
    enumerable: true,
    get: function() {
        return ApiResponseDto;
    }
});
let ApiResponseDto = class ApiResponseDto {
    static success(data, meta, message) {
        return {
            success: true,
            data,
            message,
            meta,
            timestamp: new Date().toISOString()
        };
    }
    static error(message, statusCode = 400, error) {
        return {
            success: false,
            data: null,
            message,
            error,
            timestamp: new Date().toISOString()
        };
    }
};

//# sourceMappingURL=api-response.dto.js.map