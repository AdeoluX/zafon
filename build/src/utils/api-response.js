"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const http_status_codes_1 = __importDefault(require("http-status-codes"));
class ApiResponse {
}
exports.default = ApiResponse;
ApiResponse.response = (res, statusCode, payload, message, extra = {}) => {
    const success = statusCode === http_status_codes_1.default.OK || statusCode === http_status_codes_1.default.CREATED ? true : false;
    res.status(statusCode).send(Object.assign({ status: statusCode, success,
        message, data: payload }, extra));
};
ApiResponse.ok = (res, payload, message) => {
    const msg = message !== null && message !== void 0 ? message : 'success';
    const status = http_status_codes_1.default.OK;
    return ApiResponse.response(res, status, payload, msg);
};
ApiResponse.created = (res, payload, message) => {
    const msg = message !== null && message !== void 0 ? message : 'success';
    const status = http_status_codes_1.default.CREATED;
    return ApiResponse.response(res, status, payload, msg);
};
ApiResponse.customError = (res, statusCode, message = 'Error occured', stack) => {
    const status = statusCode !== null && statusCode !== void 0 ? statusCode : http_status_codes_1.default.BAD_REQUEST;
    return ApiResponse.response(res, status, '', message, stack);
};
//# sourceMappingURL=api-response.js.map