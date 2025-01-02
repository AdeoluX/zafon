"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authRoutes = void 0;
const express_1 = __importDefault(require("express"));
const controller_1 = require("../controller");
const validate_1 = require("../middleware/validate");
const auth_validation_1 = require("../validations/auth.validation");
class AuthRoutes {
    constructor() {
        this.router = express_1.default.Router();
    }
    routes() {
        this.router.post("/sign-in", (0, validate_1.validateRequest)(auth_validation_1.signInValidation), controller_1.AuthController.prototype.signIn);
        this.router.post("/sign-up", (0, validate_1.validateRequest)(auth_validation_1.signUpValidation), controller_1.AuthController.prototype.signUp);
        return this.router;
    }
}
exports.authRoutes = new AuthRoutes();
//# sourceMappingURL=auth.routes.js.map