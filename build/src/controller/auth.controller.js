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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const api_response_1 = __importDefault(require("../utils/api-response"));
const auth_service_1 = require("../services/auth.service");
const { created, customError, ok, response } = api_response_1.default;
class AuthController {
    signIn(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const payload = req.body;
                const { success, message, token } = yield auth_service_1.AuthService.prototype.signIn(payload);
                if (!success)
                    return customError(res, 400, message);
                return ok(res, { token }, success ? "Logged in Successfully" : "Invalid Credentials.");
            }
            catch (error) {
                next(error);
            }
        });
    }
    signUp(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const payload = req.body;
                const { success, message, options, token } = yield auth_service_1.AuthService.prototype.signUp(payload);
                if (!success)
                    return customError(res, 400, message);
                return ok(res, Object.assign(Object.assign({}, options), { token }), success ? "Signed Up Successfully" : "Invalid Credentials.");
            }
            catch (error) {
                next(error);
            }
        });
    }
    forgotPassword(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const _a = yield auth_service_1.AuthService.prototype.forgotPassword(req.body), { success, message } = _a, rest = __rest(_a, ["success", "message"]);
                if (!success)
                    return customError(res, 400, message);
                return ok(res, Object.assign({}, rest), message);
            }
            catch (error) {
                next(error);
            }
        });
    }
    activateProfile(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const _a = yield auth_service_1.AuthService.prototype.activateProfile(req.body), { success, message } = _a, rest = __rest(_a, ["success", "message"]);
                if (!success)
                    return customError(res, 400, message);
                return ok(res, Object.assign({}, rest), message);
            }
            catch (error) {
                next(error);
            }
        });
    }
    changePassword(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const _a = yield auth_service_1.AuthService.prototype.changePassword(req.body), { success, message } = _a, rest = __rest(_a, ["success", "message"]);
                if (!success)
                    return customError(res, 400, message);
                return ok(res, Object.assign({}, rest), message);
            }
            catch (error) {
                next(error);
            }
        });
    }
}
exports.AuthController = AuthController;
//# sourceMappingURL=auth.controller.js.map