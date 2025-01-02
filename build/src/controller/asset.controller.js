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
exports.AssetController = void 0;
const api_response_1 = __importDefault(require("../utils/api-response"));
const asset_service_1 = require("../services/asset.service");
const helper_utils_1 = __importDefault(require("../utils/helper.utils"));
const { created, customError, ok, response } = api_response_1.default;
class AssetController {
    getAsset(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const payload = req.params.id;
                const { success, message, token } = yield asset_service_1.AssetService.prototype.getAsset(payload);
                if (!success)
                    return customError(res, 400, message);
                return ok(res, { data: { token } }, message);
            }
            catch (error) {
                next(error);
            }
        });
    }
    createAsset(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const payload = req.body;
                const { success, message, token, data } = yield asset_service_1.AssetService.prototype.createAsset(payload);
                if (!success)
                    return customError(res, 400, message);
                return ok(res, { data }, message);
            }
            catch (error) {
                next(error);
            }
        });
    }
    getAssets(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const query = req.query;
                const pagination = helper_utils_1.default.paginateOptions(query);
                const { success, message, token, data } = yield asset_service_1.AssetService.prototype.getAssets(pagination);
                if (!success)
                    return customError(res, 400, message);
                return ok(res, { data }, message);
            }
            catch (error) {
                next(error);
            }
        });
    }
    updateAssets(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const payload = req.body;
                const { success, message, token, data } = yield asset_service_1.AssetService.prototype.updateAsset(payload);
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
exports.AssetController = AssetController;
//# sourceMappingURL=asset.controller.js.map