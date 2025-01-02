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
Object.defineProperty(exports, "__esModule", { value: true });
exports.AssetService = void 0;
const asset_schema_1 = require("../models/asset.schema");
class AssetService {
    getAsset(id) {
        return __awaiter(this, void 0, void 0, function* () {
            // const { amount, authorizer: { userId } } = payload;
            // const user: IUser | null = await UserModel.findOne({ _id: userId });
            // if (!user) return { success: false, message: "Invalid credentials" };
            // const isValid = await user.isValidPassword(password);
            // if (!isValid) return { success: false, message: "Invalid credentials" };
            // const token = Utils.signToken({ email, id: user._id, role: user.role });
            return {
                success: true,
                message: "Logged in successfully.",
                // token,
            };
        });
    }
    updateAsset(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            // const { amount, authorizer: { userId } } = payload;
            // const user: IUser | null = await UserModel.findOne({ _id: userId });
            // if (!user) return { success: false, message: "Invalid credentials" };
            // const isValid = await user.isValidPassword(password);
            // if (!isValid) return { success: false, message: "Invalid credentials" };
            // const token = Utils.signToken({ email, id: user._id, role: user.role });
            return {
                success: true,
                message: "Logged in successfully.",
                // token,
            };
        });
    }
    createAsset(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            const { name, rate, type, unitPrice } = payload;
            const asset = yield asset_schema_1.AssetModel.create({
                name, rate, type, unitPrice
            });
            return {
                success: true,
                message: "Asset Created Successfully",
                data: asset
            };
        });
    }
    getAssets(pagination) {
        return __awaiter(this, void 0, void 0, function* () {
            const { page, perPage, skip } = pagination;
            const assets = yield asset_schema_1.AssetModel.find({}).skip(skip).limit(perPage);
            return {
                success: true,
                message: "Assets gotten successfully.",
                data: assets
            };
        });
    }
}
exports.AssetService = AssetService;
//# sourceMappingURL=asset.service.js.map