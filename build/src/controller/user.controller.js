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
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserController = void 0;
const api_response_1 = __importDefault(require("../utils/api-response"));
const user_service_1 = require("../services/user.service");
const helper_utils_1 = __importDefault(require("../utils/helper.utils"));
const { created, customError, ok, response } = api_response_1.default;
class UserController {
    subscribe(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const payload = req.body;
                const { success, message, token } = yield user_service_1.UserService.prototype.subscribe(payload);
                if (!success)
                    return customError(res, 400, message);
                return ok(res, { data: { token } }, message);
            }
            catch (error) {
                next(error);
            }
        });
    }
    pay(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const payload = req.body;
                const { success, message, token, data } = yield user_service_1.UserService.prototype.pay(payload);
                if (!success)
                    return customError(res, 400, message);
                return ok(res, { data }, message);
            }
            catch (error) {
                next(error);
            }
        });
    }
    topUp(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const payload = req.body;
                const assetUserId = req.params.assetUserId;
                const { success, message, token, data } = yield user_service_1.UserService.prototype.topUp(payload, assetUserId);
                if (!success)
                    return customError(res, 400, message);
                return ok(res, { data }, message);
            }
            catch (error) {
                next(error);
            }
        });
    }
    redeemAsset(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const payload = req.body;
                const assetUserId = req.params.assetUserId;
                const { success, message, token, data } = yield user_service_1.UserService.prototype.redeemAsset(payload, assetUserId);
                if (!success)
                    return customError(res, 400, message);
                return ok(res, { data }, message);
            }
            catch (error) {
                next(error);
            }
        });
    }
    assetTransactionHistory(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const userUssetId = req.params.userUssetId;
                const query = req.query;
                const paginate = helper_utils_1.default.paginateOptions(query);
                const { success, message, token, data } = yield user_service_1.UserService.prototype.assetTransactionHistory(userUssetId, paginate);
                if (!success)
                    return customError(res, 400, message);
                return ok(res, { data }, message);
            }
            catch (error) {
                next(error);
            }
        });
    }
    portfolio(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const payload = req.body.authorizer;
                const { success, message, data } = yield user_service_1.UserService.prototype.portfolio(payload);
                if (!success)
                    return customError(res, 400, message);
                return ok(res, { data }, message);
            }
            catch (error) {
                next(error);
            }
        });
    }
}
exports.UserController = UserController;
//# sourceMappingURL=user.controller.js.map