"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userRoutes = void 0;
const express_1 = __importDefault(require("express"));
const controller_1 = require("../controller");
const auth_middleware_1 = require("../middleware/auth.middleware");
const validate_1 = require("../middleware/validate");
const auth_validation_1 = require("../validations/auth.validation");
class UserRoutes {
    constructor() {
        this.router = express_1.default.Router();
    }
    routes() {
        this.router.post("/subscribe/:assetId", (0, validate_1.validateRequest)(auth_validation_1.subscribeValidation), auth_middleware_1.AuthMiddleware.withRoles(['*']).verifyUser, controller_1.UserController.prototype.subscribe);
        this.router.post("/pay", (0, validate_1.validateRequest)(auth_validation_1.payValidation), auth_middleware_1.AuthMiddleware.withRoles(['member']).verifyUser, controller_1.UserController.prototype.pay);
        this.router.post("/top-up/:assetUserId", (0, validate_1.validateRequest)(auth_validation_1.payValidation), auth_middleware_1.AuthMiddleware.withRoles(['member']).verifyUser, controller_1.UserController.prototype.topUp);
        this.router.get("/portfolio", auth_middleware_1.AuthMiddleware.withRoles(['admin', 'member']).verifyUser, controller_1.UserController.prototype.portfolio);
        this.router.post("/redeem/:assetUserId", auth_middleware_1.AuthMiddleware.withRoles(['member']).verifyUser, controller_1.UserController.prototype.redeemAsset);
        this.router.get("/asset/transaction-history/:userUssetId", auth_middleware_1.AuthMiddleware.withRoles(['member']).verifyUser, controller_1.UserController.prototype.assetTransactionHistory);
        // this.router.get("/transaction-history", AuthMiddleware.withRoles(['member']).verifyUser, UserController.prototype.transactionHistory);
        return this.router;
    }
}
exports.userRoutes = new UserRoutes();
//# sourceMappingURL=user.routes.js.map