"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const stream_1 = require("stream");
class ApiResponse {
}
_a = ApiResponse;
ApiResponse.response = (res, statusCode, payload, message, extra = {}) => {
    const success = statusCode === http_status_codes_1.default.OK || statusCode === http_status_codes_1.default.CREATED ? true : false;
    res.status(statusCode).send(Object.assign(Object.assign({ status: statusCode, success,
        message }, payload), extra));
};
ApiResponse.ok = (res, payload, message) => {
    const msg = message !== null && message !== void 0 ? message : 'success';
    const status = http_status_codes_1.default.OK;
    return _a.response(res, status, payload, msg);
};
ApiResponse.created = (res, payload, message) => {
    const msg = message !== null && message !== void 0 ? message : 'success';
    const status = http_status_codes_1.default.CREATED;
    return _a.response(res, status, payload, msg);
};
ApiResponse.customError = (res, statusCode, message = 'Error occured', stack) => {
    const status = statusCode !== null && statusCode !== void 0 ? statusCode : http_status_codes_1.default.BAD_REQUEST;
    return _a.response(res, status, {}, message, stack);
};
ApiResponse.downloadFile = (res, fileData, fileName, content_type) => __awaiter(void 0, void 0, void 0, function* () {
    let fileContents = Buffer.from(fileData, 'base64');
    let readStream = new stream_1.Stream.PassThrough();
    readStream.end(fileContents);
    res.attachment(fileName);
    res.setHeader('Content-Type', content_type);
    return res.send(fileData);
});
exports.default = ApiResponse;
//# sourceMappingURL=api-response.js.map