"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.assetRoutes = void 0;
const express_1 = __importDefault(require("express"));
const controller_1 = require("../controller");
const auth_middleware_1 = require("../middleware/auth.middleware");
const validate_1 = require("../middleware/validate");
const auth_validation_1 = require("../validations/auth.validation");
class AssetRoutes {
    constructor() {
        this.router = express_1.default.Router();
    }
    routes() {
        this.router.get("/", auth_middleware_1.AuthMiddleware.withRoles(['admin', 'member']).verifyUser, controller_1.AssetController.prototype.getAssets);
        this.router.get("/:id", auth_middleware_1.AuthMiddleware.withRoles(['admin', 'member']).verifyUser, controller_1.AssetController.prototype.getAsset);
        this.router.post("/", (0, validate_1.validateRequest)(auth_validation_1.createAssetValidation), auth_middleware_1.AuthMiddleware.withRoles(['admin']).verifyUser, controller_1.AssetController.prototype.createAsset);
        this.router.patch("/:id", (0, validate_1.validateRequest)(auth_validation_1.updateAssetValidation), auth_middleware_1.AuthMiddleware.withRoles(['admin']).verifyUser, controller_1.AssetController.prototype.updateAssets);
        return this.router;
    }
}
exports.assetRoutes = new AssetRoutes();
//# sourceMappingURL=asset.routes.js.map